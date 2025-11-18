import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {authorizationLoginPost} from '../../api/fn/authorization/authorization-login-post';
import {AuthService} from '../../services/auth-service';

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
    MatInput
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  constructor(private auth: AuthService){

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
    }).subscribe(res => {
      this.auth.setAuthData(res.body);
    });
  }
}
