import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userPhotoUrl: string = '';
  currentUser: any;
  profileForm!: FormGroup;
  userId: string = '';

  // @@ File selection
  onFileSelect(event: Event, fileType: string): void {
    console.log(fileType, event);
  }

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('ROSTER-ID') || '';
    console.log('User ID:', this.userId);

    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required], 
      DOB: ['', Validators.required],
      nationality: ['', Validators.required],
      address: ['', Validators.required],
      idNumber: ['', Validators.required],
    });

    this.loadUserProfile();

    this.profileForm.controls['phoneNumber'].valueChanges.subscribe(value => {
      this.onPhoneNumberChange(value);
    });
  }

  loadUserProfile(): void {
    if (!this.userId) {
      console.error('No User ID found. Cannot load profile.');
      return;
    }

    this.authService.getUserById(this.userId).subscribe(
      (data: any) => {
        if (!data || !data.name) {
          console.error('Invalid user data:', data);
          return;
        }
        console.log('Full user data:', data);
        this.currentUser = data;

        this.userPhotoUrl = data.profileImageBase64 || '/assets/icons/user.png';

        this.profileForm.patchValue({
          name: data.name,
          email: data.email,
          phoneNumber: this.formatPhoneNumber(data.phoneNumber),
          DOB: data.DOB,
          nationality: data.nationality,
          address: data.address,
          idNumber: data.idNumber,
        });
      },
      (error: any) => {
        console.error('Error loading user profile:', error);
      }
    );
  }
  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
  
    // Remove all non-numeric characters
    const numbersOnly = phoneNumber.replace(/\D/g, '');
  
    // Limit to a maximum of 9 digits
    const maxDigits = 9;
    const trimmed = numbersOnly.slice(0, maxDigits);
  
    // Apply formatting if we have enough digits
    if (trimmed.length >= 9) {
      return `(${trimmed.slice(0, 2)}) ${trimmed.slice(2, 5)}-${trimmed.slice(5, 9)}`;
    }
  
    return trimmed; // Return unformatted if less than 9 digits
  }

  onPhoneNumberChange(phoneNumber: string): void {
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    
    if (phoneNumber !== formattedNumber) {
      this.profileForm.controls['phoneNumber'].setValue(formattedNumber, { emitEvent: false });
    }
  } 

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.authService
        .updateUserProfile(this.userId, this.profileForm.value)
        .subscribe(
          (response: any) => {
            console.log('Profile updated successfully:', response);
            this.showSuccess();

            this.getUserProfile();
          },
          (error: any) => {
            console.error('Error updating profile:', error);
            this.showError('Error updating profile.');
          }
        );
    }
  }
  getUserProfile(): void {
    this.authService.getUserProfile(this.userId).subscribe(
      (profile: any) => {
        this.currentUser = profile;
        this.userPhotoUrl = profile.photoUrl;
      },
      (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
  showSuccess() {
    this.snackBar.open(`You updated your information successfully!!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
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
}

