import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { getControlErrorMessage } from '../../core/utils/utility/error-messages.utility';

@Component({
  standalone: true,
  selector: 'growth-fit-input-text-v2',
  imports: [CommonModule, FormsModule],
  templateUrl: './growth-fit-input-text-v2.component.html',
  styleUrls: ['./growth-fit-input-text-v2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GrowthFitInputTextV2Component),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GrowthFitInputTextV2Component),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class GrowthFitInputTextV2Component implements ControlValueAccessor {
  @Input() id: string = 'growthFitInputText';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() maxlength = 15;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() modifiedBorder = true;
  @Input() modifiedAndTouchedBorder = false;
  @Input() textAlignLeft: boolean = true;
  @Input() showTooltipErrorMessage = true;
  @Input() customErrorMessage: string = '';
  @Input() modifiedBorderWithChanges: boolean = false;
  @Input() checkErrorsAgain: boolean = false;
  @Input() mustVerifyChanges: boolean = false;

  @Input() disabled = false;
  @Input() whiteSpace: string = 'nowrap';
  @Input() modeError: boolean = false;

  @Input()
  set externalErrors(errors: any) {
    this.inputFormControl.setErrors(errors);
    this.getErrorMessage();
  }

  @Output() bluredWithChanges = new EventEmitter<void>();
  @Output() onInputChange = new EventEmitter<any>();
  @Output() onModifiedWithChanges = new EventEmitter<{ modified: boolean; value: any }>();

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  public value: any;
  public valueOnFocus: any;
  public modified: boolean = false;
  public modifiedWithChanges: boolean = false;
  public firstValue: any;
  public rendered: boolean = false;
  public inputFormControl = new FormControl();
  public errorMessage = signal<string>('');
  public focused = false;

  onChange: any = () => {};
  onTouched: any = () => {};
  onValidatorChange: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: any): void {
    this.onValidatorChange = fn;
  }

  ngAfterViewInit(): void {
    this.rendered = true;
  }

  validate(control: FormControl): ValidationErrors | null {
    if (control) {
      this.inputFormControl = control;
      setTimeout(() => this.getErrorMessage(), 0);
    }

    return this.inputFormControl.invalid ? { invalid: true } : null;
  }

  getErrorMessage() {
    if (this.inputFormControl.errors) {
      const genericErrorMessage = getControlErrorMessage(this.inputFormControl);
      if (genericErrorMessage) {
        this.errorMessage.set(genericErrorMessage);
      } else {
        this.errorMessage.set(this.customErrorMessage);
      }
    }
  }

  writeValue(data: any): void {
    this.value = data;
    if (!this.rendered) {
      this.firstValue = this.value;
    }
    this.checkModified();
  }

  onInput() {
    this.onTouched();
    if (this.value === '') {
      this.value = null;
    }
    this.checkModified();
    this.onChange(this.value);
    this.onInputChange.emit(this.value);
    this.processChangesValidation();
  }

  onBlur() {
    this.focused = false;
    if (this.valueOnFocus !== this.value) {
      this.bluredWithChanges.emit();
    }
    this.validateCheckErrorsAgain();
  }

  checkModified() {
    if (this.modifiedBorder && !this.modifiedAndTouchedBorder) {
      this.modified = this.value !== this.firstValue;
    }

    if (!this.modifiedBorder && this.modifiedAndTouchedBorder) {
      this.modified = this.value !== this.firstValue && this.inputFormControl.touched;
    }

    if (!this.modifiedBorderWithChanges && this.rendered) {
      this.onModifiedWithChanges.emit({ modified: this.modified, value: this.value });
    }

    this.checkModifiedWithChanges();
  }

  private checkModifiedWithChanges() {
    if (this.modifiedBorderWithChanges && this.rendered) {
      this.modifiedWithChanges = this.value !== this.firstValue;
      this.onModifiedWithChanges.emit({ modified: this.modifiedWithChanges, value: this.value });
    }
  }

  onFocus() {
    this.valueOnFocus = this.value;
    this.focused = true;
    this.validateCheckErrorsAgain();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  containerClicked(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.inputElement.nativeElement.focus();
  }

  /*hasError(): boolean {
    let isError = this.inputFormControl?.invalid ;
    if (this.modeError) {
      isError = !!this.inputFormControl.errors;
    }
    return isError;
  }*/

  getStyleTextError(): Object {
    return {
      ['white-space']: this.whiteSpace,
    };
  }

  public getInputClass() {
    return {
      [`${this.size}`]: true,
      [`growth-fit-input-mask`]: true,
      [`modified`]: this.modified,
      [`disabled`]: this.disabled,
      [`text-align-left`]: this.textAlignLeft,
      [`invalid`]: this.inputFormControl?.invalid,
    };
  }

  private validateCheckErrorsAgain(): void {
    if (this.checkErrorsAgain) {
      setTimeout(() => this.getErrorMessage(), 300);
    }
  }

  private processChangesValidation(): void {
    if (!this.mustVerifyChanges) {
      this.checkModified();
      this.validateCheckErrorsAgain();
    } else {
      setTimeout(() => {
        this.checkModified();
        this.validateCheckErrorsAgain();
      }, 500);
    }
  }
}
