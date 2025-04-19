import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Collapse } from 'bootstrap';
import { AuthService } from '../../services/auth-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.navbarNav && this.navbarNav.nativeElement.classList.contains('show')) {
      // @@ also close when click any where
      if (!this.navbarNav.nativeElement.contains(event.target)) {
        const bsCollapse = Collapse.getOrCreateInstance(this.navbarNav.nativeElement);
        bsCollapse.hide();
      }
    }
  }

  closeMenu() {
    if (this.navbarNav && this.navbarNav.nativeElement.classList.contains('show')) {
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
