import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface RegisterForm {
  name: FormControl,
  email: FormControl,
  password: FormControl,
  passwordConfirm: FormControl
}

@Component({
  selector: 'app-register',
  providers: [LoginService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup<RegisterForm>;
  hidePassword = true; 
  hidePasswordConfirm = true;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ){
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }
  submit() {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill all required fields!', 'Close', {
        duration: 3000,
        panelClass: ['snack-error']
      });
      return;
    }  
    if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
      this.snackBar.open('Passwords don`t match!', 'Close', {
        duration: 3000,
        panelClass: ['snack-error']
      });
      return;
    }  
    this.loginService.login(this.registerForm.value.email, this.registerForm.value.password).subscribe({
      next: () => {
        this.snackBar.open('Register successful!', 'Close', {
          duration: 3000,
          panelClass: ['snack-success']
        });
        this.router.navigate(['/dashboard']); 
      },
      error: () => {
        this.snackBar.open('Unexpected error! Try again later.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
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
  togglePasswordConfirm() {
    this.hidePasswordConfirm = !this.hidePasswordConfirm;
  }
  navigate(){
    this.router.navigate(["login"])
  }
}