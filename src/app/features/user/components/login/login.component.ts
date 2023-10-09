import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { passwordPattern } from 'src/app/constants/pattern';
import { AuthResponse } from 'src/app/core/interceptors/interceptors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  submit = false;
  passwordShown = false;
  errorMessage=""
  subscription: Subscription | undefined;

  constructor(
    private FormBuilder: FormBuilder,
    private ApiService: ApiService,
    private router: Router,
  ) {}

  loginForm = this.FormBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
  });

  get f() {
    return this.loginForm.controls;
  }
  onSubmit(): void {
    this.submit = true;
    if (this.loginForm.valid ) {
      console.log(this.loginForm.value);
      this.subscription = this.ApiService.userLogin(
        this.loginForm.value
      ).subscribe((data:AuthResponse) => {
      if(data.status){        
        localStorage.setItem('token', data.token);
        this.errorMessage = '';
        this.router.navigate(['/']);
      }else{
        this.errorMessage=data.message
      }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.passwordShown = !this.passwordShown;
  }
}