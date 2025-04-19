import { Injectable } from '@angular/core';
import { CanActivate, Router  } from '@angular/router';
import { AuthService } from '../services/auth-service.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor( 
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    if ( this.authService.isManager() ) { 
      console.log('User is a Manager');
      return true; 
    } 
    else {
      console.log('User is not a Manager');
      this.showError('Unauthorized !!');
      window.location.href = '/login';
      return false;
    }
  }
  showError(message: string) {
    this.snackBar.open(message, 'Retry', {
      duration: 3000,
      panelClass: ['snack-error'],
    });
  }
}
