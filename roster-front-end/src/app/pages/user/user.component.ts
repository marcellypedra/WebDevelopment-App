import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  searchForm!: FormGroup;
  editForm!: FormGroup;
  currentUser: any;
  users: any[] = [];
  selectedUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
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
      email: user.email
    });
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
