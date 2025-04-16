import { Component, ViewChild, ElementRef } from '@angular/core';
import { Collapse } from 'bootstrap';
import { AuthService } from '../../services/auth-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}
  @ViewChild('navbarNav') navbarNav!: ElementRef;

  closeMenu() {
    if (this.navbarNav) {
      const bsCollapse = Collapse.getOrCreateInstance(this.navbarNav.nativeElement);
      bsCollapse.hide();
    }
  }
  isManager(): boolean {
    return this.authService.isManager();
  }
  
  logout() {
    this.authService.logout();
  }
}
