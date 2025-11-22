import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {authorizationLoginPost} from '../../api/fn/authorization/authorization-login-post';
import {AuthService} from '../../services/auth-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {NotificationComponent, NotificationStatus} from '../notification-component/notification-component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    FormsModule,
    MatButton,
    MatInput,
    RouterLink,
    MatCardHeader,
    MatIcon,
    NotificationComponent,
    NgIf
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  isShowNotification = false;
  notificationMessage = '';
  notificationStatus: NotificationStatus = 'info';

  constructor(private auth: AuthService,
              private router: Router){

  }
  onSubmit() {
    if (this.username && this.password) {
      this.login();
    }
  }

  login(){
    authorizationLoginPost(this.http, this.rootUrl, {
      body: {
        username: this.username,
        password: this.password
      }
    }).subscribe({
      next: (res) => {
        this.auth.setAuthData(res.body);
        this.router.navigate(['']);
      },
        error: (error) => {
        this.showNotification(error.error,"error");
        console.error('Ошибка авторизации:', error);
      }
    });
  }

  private showNotification(message: string, status: NotificationStatus) {
    this.notificationMessage = message;
    this.notificationStatus = status;
    this.isShowNotification = true;
  }

  onNotificationClosed() {
    this.isShowNotification = false;
  }
}
