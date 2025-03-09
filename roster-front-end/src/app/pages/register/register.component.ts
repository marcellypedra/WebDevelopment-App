import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface RegisterForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  address: FormControl<string | null>;
  DOB: FormControl<string | null>;
  nationality: FormControl<string | null>;
  visaExpiryDate: FormControl<string | null>;
  idNumber: FormControl<string | null>;
  roleType: FormControl<string | null>;
}

@Component({
  selector: 'app-register',
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup<RegisterForm>;
  selectedFiles: Record<string, File | undefined> = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]*$/) // Letters and spaces only
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(15),
        Validators.pattern(/^\d{9,15}$/) // Only numbers, 10-15 digits
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(30)
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]),
      DOB: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/) // Format: YYYY-MM-DD
      ]),
      nationality: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
       Validators.pattern(/^[a-zA-Z\s]*$/) // Letters and spaces only
      ]),
      visaExpiryDate: new FormControl('', [
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/) // Format: YYYY-MM-DD
      ]),
      idNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(15),
        Validators.pattern(/^\d{9,15}$/) // Only numbers, 9-15 digits
      ]),
      roleType: new FormControl('', [
        Validators.required
      ])
    });

    //  Create a password userName + YearBirth.
    this.registerForm.get('name')?.valueChanges.subscribe(() => this.updatePassword());
    this.registerForm.get('DOB')?.valueChanges.subscribe(() => this.updatePassword());
  }

  onFileSelect(event: any, field: string) {
    this.selectedFiles[field] = event.target.files[0];
  }

  private updatePassword(): string {
    const name = this.registerForm.value.name?.trim();
    const DOB = this.registerForm.value.DOB;
  
    if (name && DOB) {
      const firstName = name.split(' ')[0];
      const birthYear = new Date(DOB).getFullYear();
      return `${firstName}${birthYear}`;
    }
    return '';
  }
  
  submit() {
    if (!this.registerForm.valid) {
      
      Object.keys(this.registerForm.controls).forEach(key => {
        const controlErrors = this.registerForm.get(key)?.errors;
        if (controlErrors) {
          console.error(`Field ${key} is invalid:`, controlErrors);
        }
      });  
      return;
    }
  
    const { name, email, phoneNumber, DOB, nationality, address, idNumber, visaExpiryDate, roleType } = this.registerForm.value;
  
    const defaultPassword = this.updatePassword(); 
  
    const userData =  { name, email, password: defaultPassword, phoneNumber, DOB, nationality, address, idNumber, visaExpiryDate, roleType };
  
    console.log('Submitting user data:', userData);
  
    this.authService.register(userData).subscribe({
      next: () => {
        this.snackBar.open('Employee registered successfully!', 'Close', { duration: 3000, panelClass: ['snack-success'] });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.snackBar.open(err.error?.message || 'Registration failed! Try again.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  } 

  navigate() {
    this.router.navigate(['login']);
  }
}