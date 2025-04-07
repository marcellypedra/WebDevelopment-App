import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userProfileImage: string | null = null; 
  userIdFile: string | null = null;
  userVisaFile: string | null = null;

  searchForm!: FormGroup;
  editForm!: FormGroup;

  currentUser: any;
  users: any[] = [];
  userId: string = '';
  selectedUser: any = null;

   // @@ File selection
   selectProfileImage: File | null = null;
   selectIdFile: File | null = null;
   selectVisaFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {   
    this.userId = this.authService.getUserIdFromToken() || '';
    console.log('Users Page: User ID:', this.userId);

    if (!this.userId) {
      console.error('User ID is missing from session storage!');
      return;
    }
  
    this.searchForm = this.fb.group({
      search: ['', Validators.required]
    });

    this.loadUserProfile();

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required], 
      DOB: ['', Validators.required],
      nationality: ['', Validators.required],
      address: ['', Validators.required],
      idNumber: ['', Validators.required],
      roleType: ['', Validators.required],
      visaExpiryDate: ['', Validators.required],
      password: ['']      
    });
    this.editForm.controls['phoneNumber'].valueChanges.subscribe(value => {
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

        this.editForm.patchValue({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: this.formatPhoneNumber(data.phoneNumber || ''),
          DOB: data.DOB || '',
          nationality: data.nationality || '',
          address: data.address || '',
          idNumber: data.idNumber || '',
          roleType: data.roleType || '',
          password: ''
        });
      },
      (error: any) => {
        console.error('Error loading user:', error);
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
      this.editForm.controls['phoneNumber'].setValue(formattedNumber, { emitEvent: false });
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
            this.selectProfileImage = selectedFile;
            break;
          case 'IdFile':
            this.userIdFile = e.target.result;
            this.selectIdFile = selectedFile;
            break;
          case 'visaFile':
            this.userVisaFile = e.target.result;
            this.selectVisaFile = selectedFile;
            break;
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  searchUsers(): void {
    if (this.searchForm.valid) {
      const query = this.searchForm.get('search')?.value;
      this.authService.searchUsers(query).subscribe(
        (response: any) => {
          if (response && response.users) {
            this.users = response.users.map((user: any) => ({
              ...user,
              profileImage: user.profileImage && typeof user.profileImage === 'string'
                ? `data:image/jpeg;base64,${user.profileImage}`
                : '/assets/icons/user.png' 
            }));            
          } else {
            this.users = [];
          }
          console.log('Users Data:', this.users);
        },
        (error: any) => {
          console.error('Error searching users:', error);
        }
      );
    }
  }  

  selectUser(user: any): void {
    this.selectedUser = { ...user };
  
    this.selectedUser.profileImage = user.profileImage && typeof user.profileImage === 'string'
    ? `data:image/jpeg;base64,${user.profileImage}`
    : '/assets/icons/user.png'; 
  
    this.editForm.patchValue({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: this.formatPhoneNumber(user.phoneNumber || ''),
      DOB: user.DOB || '',
      nationality: user.nationality || '', 
      visaExpiryDate: user.visaExpiryDate || '',
      address: user.address || '',
      idNumber: user.idNumber || '',
      roleType: user.roleType || '',
      password: ''
    });  
    console.log('Selected User:', this.selectedUser);
  }
  
  updateUser(): void {
    if (this.editForm.valid && this.selectedUser) {
      const updatedData = this.editForm.value;
      this.authService.updateUser(this.selectedUser._id, updatedData).subscribe(
        (data: any) => {
          console.log('User updated successfully:', data);
          this.searchUsers(); 
        },
        (error: any) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  deleteUser(): void {
    if (this.selectedUser) {
      this.authService.deleteUser(this.selectedUser._id).subscribe(
        (data: any) => {
          console.log('User deleted successfully:', data);
          this.searchUsers(); 
        },
        (error: any) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

}