import {Component, inject, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {AuthService} from '../../services/auth-service';
import {authorizationRegisterPost} from '../../api/fn/authorization/authorization-register-post';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register-component',
  imports: [
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardTitle,
    MatCardContent,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatStepLabel,
    MatButton,
    MatStepperPrevious,
    MatStepperNext,
    RouterLink,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent implements OnInit{
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';
  personalForm!: FormGroup;
  accountForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.accountForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.personalForm.invalid || this.accountForm.invalid) {
      return;
    }

    this.register(this.personalForm.value.firstName,this.personalForm.value.lastName,
      this.accountForm.value.username,this.accountForm.value.password);
  }

  private register(firstName: string,lastName: string,username: string,password: string ){
    authorizationRegisterPost(this.http,this.rootUrl,{
      body: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
      }
    }).subscribe({
      next: (res) => {
        if(res){
          this.auth.setAuthData(res.body);
          this.router.navigate(['']);
          console.log('Регистрация прошла успешно');
        }
      },
      error: (error) => {
        console.error('Ошибка регистрации:', error);
      }
    })
  }
}
