import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginForm {
  email: FormControl;
  password: FormControl;
  name: FormControl;
}

@Component({
  selector: 'app-login',
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;
  hidePassword = true;
  disableButton = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: new FormControl(''),
    });
    this.loginForm.valueChanges.subscribe(() => {
      this.disableButton = !this.loginForm.valid;
    });
  }
  submit() {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (response) => {
            console.log('Login Response:', response);

            this.showSuccess( `Welcome back, ${response.user.name}!` );

            this.router.navigate(['/dashboard']);
          },
          error: (err) =>
            this.showError(
              err.error?.message || 'Login failed. Please try again.'
            ),
        });
    } else {
      this.showError('Please fill in all required fields.');
    }
  }
  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snack-success'],
    });
  }
  showError(message: string) {
    this.snackBar.open(message, 'Retry', {
      duration: 3000,
      panelClass: ['snack-error'],
    });
  }
  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
  navigate() {
    this.router.navigate(['profile']);
  }
  resetPassword(email: string) {
    //@@ TODO :  password reset
    console.log('Password reset requested for:', email);
    this.showSuccess('Password reset email sent. Please check your inbox.');
    this.closeModal();
  }
  isModalVisible = false;
  forgotPassword() {
    this.isModalVisible = true;
  }
  closeModal() {
    this.isModalVisible = false;
  }
}
