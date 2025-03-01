import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginForm {
  email: FormControl,
  password: FormControl
}

@Component({
  selector: 'app-login',
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;
  hidePassword = true; 

  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }
  submit() {
    if (this.loginForm.valid) {
      this.loginService.login(
        this.loginForm.value.email, 
        this.loginForm.value.password
      ).subscribe({
        next: () => {
          this.showSuccess();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.showError(err.error?.message || 'Login failed. Please try again.')
      });
    } else {
      this.showError('Please fill in all required fields.');
    }
  } 
  showSuccess() {
    this.snackBar.open('Login successful!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',   
      verticalPosition: 'top',
      panelClass: ['snack-success']  
    });
  }
  showError(message: string) {
    this.snackBar.open(message, 'Retry', {
      duration: 3000,
      panelClass: ['snack-error']
    });
  }
  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
  navigate(){
    this.router.navigate(["register"])
  }
  // forgotPassword() { this.router.navigate(['/forgot-password']); }  
}