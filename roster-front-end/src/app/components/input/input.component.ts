import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl , NG_VALUE_ACCESSOR } from '@angular/forms';

type InputTypes = "text" | "email" | "password" | "date";

@Component({
  selector: 'app-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputTypes = "text";
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() inputName: string = "";
  @Input() mask: string = ""; 

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: Event){
    const value = (event.target as HTMLInputElement).value
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
  writeValue(value: any): void {
    this.value = value || '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {}
}