import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private apiUrl = environment.apiUrl;

  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
    const token = sessionStorage.getItem('ROSTER-AUTH');
  
    if (token && this.isValidToken(token)) {
      return Promise.resolve(true);
    }
  
    return this.tryRefreshToken();
  }
  
  private async tryRefreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refreshToken`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
  
      if (data.accessToken) {
        sessionStorage.setItem('ROSTER-AUTH', data.accessToken);
        console.log('Token refreshed!');
        return true;
      } else {
        console.warn('Unable to refresh token');
        this.router.navigate(['/login']).then(() => {
          window.location.reload(); 
        });
        return false;
      }
    } catch (err) {
      console.error('Refresh error:', err);
      return false;
    }
  }  

  private isValidToken(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.warn("Token expired!");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  }
}
