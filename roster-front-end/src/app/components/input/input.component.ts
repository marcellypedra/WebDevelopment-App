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
  @Input() formControl!: FormControl;
  @Input() type: InputTypes = "text";
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() inputName: string = "";
  @Input() mask: string = ""; 
  @Input() maxlength: number | null = null;
  @Input() minlength: number | null = null;


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
    if (this.type === 'date' && value) {
      const d = new Date(value);
      const yyyy = d.getFullYear();
      const mm = ('0' + (d.getMonth() + 1)).slice(-2);
      const dd = ('0' + d.getDate()).slice(-2);
      this.value = `${yyyy}-${mm}-${dd}`;
    } else {
      this.value = value || '';
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {}
}