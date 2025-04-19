import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyLetters]'
})
export class OnlyLettersDirective {
  private regex: RegExp = /^[a-zA-ZÀ-ÿ\s]$/;
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
