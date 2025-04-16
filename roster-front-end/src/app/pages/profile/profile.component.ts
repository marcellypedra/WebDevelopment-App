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
  userProfileImage: string | null = null; 
  userIdFile: string | null = null;
  userVisaFile: string | null = null;

  currentUser: any;
  profileForm!: FormGroup;
  userId: string = '';
  
  // @@ File selection
  selectedProfileImage: File | null = null;
  selectedIdFile: File | null = null;
  selectedVisaFile: File | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken() || '';
    console.log('Profile Page: User ID:', this.userId);

    if (!this.userId) {
      console.error('User ID is missing from session storage!');
      return;
    }
    this.loadUserProfile();

    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required], 
      address: ['', Validators.required],
    });

    this.profileForm.controls['phoneNumber'].valueChanges.subscribe(value => {
      this.onPhoneNumberChange(value);
    });
  }
  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/icons/user.png'; //@@ If don't find the profileImage
  }

  loadUserProfile(): void {
    if (!this.userId) {
      console.error('No User ID found. Cannot load profile.');
      return;
    }

    this.authService.loadUserProfile(this.userId).subscribe(
      (data: any) => {
        if (!data || !data.name) {
          console.error('Invalid user data:', data);
          return;
        }
        console.log('User profile loaded:', data);
        this.currentUser = data;

         //@@ If don't find the profileImage
         this.userProfileImage = data.profileImage && data.profileImage !== '' 
         ? data.profileImage : '/assets/icons/user.png';

        this.profileForm.patchValue({
          email: data.email || '',
          phoneNumber: this.formatPhoneNumber(data.phoneNumber || ''),
          address: data.address || '',
        });
      },
      (error: any) => {
        console.error('Error loading user profile:', error);
      }
    );
  }
  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';

    const numbersOnly = phoneNumber.replace(/\D/g, '');
    const maxDigits = 9;
    const trimmed = numbersOnly.slice(0, maxDigits);
  
    if (trimmed.length >= 9) {
      return `(${trimmed.slice(0, 2)}) ${trimmed.slice(2, 5)}-${trimmed.slice(5, 9)}`;
    }
    return trimmed; 
  }

  onPhoneNumberChange(phoneNumber: string): void {
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    
    if (phoneNumber !== formattedNumber) {
      this.profileForm.controls['phoneNumber'].setValue(formattedNumber, { emitEvent: false });
    }
  } 
  onFileSelect(event: any, fileType: string): void {
    const selectedFile = event.target.files[0] as File;

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        switch (fileType) {
          case 'profileImage':
            this.userProfileImage = e.target.result;
            this.selectedProfileImage = selectedFile;
            break;
          case 'IdFile':
            this.userIdFile = e.target.result;
            this.selectedIdFile = selectedFile;
            break;
          case 'visaFile':
            this.userVisaFile = e.target.result;
            this.selectedVisaFile = selectedFile;
            break;
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
  
      formData.append('email', this.profileForm.value.email);
      formData.append('phoneNumber', this.profileForm.value.phoneNumber);
      formData.append('address', this.profileForm.value.address);
      
      // @@ Check images if they exist
      if (this.selectedProfileImage) {
        formData.append('profileImage', this.selectedProfileImage, this.selectedProfileImage.name);
      }
      if (this.selectedIdFile) {
        formData.append('idFile', this.selectedIdFile, this.selectedIdFile.name);
      }
      if (this.selectedVisaFile) {
        formData.append('visaFile', this.selectedVisaFile, this.selectedVisaFile.name);
      }
  
      this.authService.updateUserProfile(this.userId, formData).subscribe(
        (response: any) => {
          console.log('Profile updated successfully:', response);
          this.showSuccess();
          this.loadUserProfile(); // @@ Refresh profile data after update
        },
        (error: any) => {
          console.error('Error updating profile:', error);
          this.showError('Error updating profile.');
        }
      );
    }
  }
  
  getUserProfile(): void {
    this.authService.getUserProfile().subscribe(
      (profile: any) => {
        this.currentUser = profile;
        this.userProfileImage = profile.profileImage;
        this.userIdFile = profile.idFile;
        this.userVisaFile = profile.visaFile;   
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