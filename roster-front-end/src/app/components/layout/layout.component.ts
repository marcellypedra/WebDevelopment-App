import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @Input() title: string = '';
  @Input() primaryBtnText: string = '';
  @Input() disablePrimaryBtn: boolean = true;
  @Input() src: string | null = null;
  @Input() userPhoto: string | null = null;

  @Output() submit = new EventEmitter<void>();
  @Output("navigate") onNavigate = new EventEmitter();
  
  onPrimaryButtonClick() { this.submit.emit(); }
  navigate(){ this.onNavigate.emit(); }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/logo/logo.png'; 
  }
}