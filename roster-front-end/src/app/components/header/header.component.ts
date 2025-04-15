import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  isManager(): boolean {
    return this.authService.isManager();
  }
  
  logout() {
    this.authService.logout();
  }
}
