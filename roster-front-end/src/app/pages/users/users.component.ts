import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  searchForm!: FormGroup;
  editForm!: FormGroup;
  userPhotoUrl: string = '';
  currentUser: any;
  users: any[] = [];
  userId: string = '';
  selectedUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('ROSTER-ID') || '';
    console.log('User ID:', this.userId);
    
    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }
  
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required]
    });
  
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required], 
      DOB: ['', Validators.required],
      nationality: ['', Validators.required],
      address: ['', Validators.required],
      idNumber: ['', Validators.required],
      password: [''] 
    });
  
    this.loadUserProfile();
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

        this.userPhotoUrl = this.currentUser.profileImage?.data
        ? `data:${this.currentUser.profileImage.contentType};base64,${this.currentUser.profileImage.data.toString('base64')}`
        : '/assets/icons/user.png';

        this.editForm.patchValue({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          DOB: data.DOB,
          nationality: data.nationality,
          address: data.address,
          idNumber: data.idNumber,
          password: data.password
        });
      },
      (error: any) => {
        console.error('Error loading user profile:', error);
      }
    );
  }
    
  searchUsers(): void {
    if (this.searchForm.valid) {
      const query = this.searchForm.get('searchQuery')?.value;
      this.authService.searchUsers(query).subscribe(
        (response: any) => {
          if (response && response.users) {
            this.users = response.users; 
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
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      password: ''
    });

    if (user.profileImage?.data) {
      this.selectedUser.profileImage = `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`;
    } else {
      this.selectedUser.profileImage = '/assets/icons/user.png';
    }
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