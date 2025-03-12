import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  @Input() label: string = 'Password';
  @Input() control: FormControl = new FormControl('');

  hide = true;
}
