import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {
  private regex: RegExp = /^[0-9]$/;
  private specialKeys: string[] = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      this.specialKeys.includes(event.key) ||
      this.regex.test(event.key)
    ) {
      return;
    }
    event.preventDefault();
  }
}
