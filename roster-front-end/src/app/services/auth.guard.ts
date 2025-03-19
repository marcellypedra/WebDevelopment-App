import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode}  from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('ROSTER-AUTH');

    if (!token || !this.isValidToken(token)) {
      this.router.navigate(['/login']);
      return false;
    }    
    return true;
  }

  private isValidToken(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      
      // @@ Check token expired
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
