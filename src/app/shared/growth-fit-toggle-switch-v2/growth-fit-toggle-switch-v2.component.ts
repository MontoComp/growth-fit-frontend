import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { getControlErrorMessage } from '../../core/utils/utility/error-messages.utility';
import { PositionSwitched } from '../../core/utils/models/toggle-switch.enum';
import { CommonModule } from '@angular/common';
import { GrowthFitIconComponent } from '../growth-fit-icon/growth-fit-icon.component';

@Component({
  standalone: true,
  selector: 'growth-fit-toggle-switch-v2',
  imports: [CommonModule, GrowthFitIconComponent],
  templateUrl: './growth-fit-toggle-switch-v2.component.html',
  styleUrls: ['./growth-fit-toggle-switch-v2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GrowthFitToggleSwitchV2Component),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GrowthFitToggleSwitchV2Component),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class GrowthFitToggleSwitchV2Component {
  @Input() defaultValue: boolean = false;
  @Input() leftText: string = 'Por Finca';
  @Input() rightText: string = 'Por Piscina';
  @Input() iconLeft: string = '';
  @Input() iconRight: string = '';
  @Input() customErrorMessage: string = '';
  @Input() useCurrentColor: boolean = false;

  @Input() disabled: boolean = false;
  @Input() size: 'medium' | 'large' | 'small' = 'medium';
  @Input() type: 'secondary-purple' | 'primary' = 'primary';

  @Output() toggleClick = new EventEmitter<boolean>();
  @Output() onModifiedWithChanges = new EventEmitter<{ modified: boolean; value: any }>();

  public positionSwitched = PositionSwitched;
  public value: boolean = false;
  public inputFormControl = new FormControl();
  public errorMessage: string = '';
  public firstValue: any;
  public modified: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};
  onValidatorChange: any = () => {};

  ngOnInit(): void {
    if (this.defaultValue !== null) {
      this.value = this.defaultValue;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: any): void {
    this.onValidatorChange = fn;
  }

  writeValue(value: boolean): void {
    this.value = value;
    this.firstValue = this.value;
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
        this.errorMessage = genericErrorMessage;
      } else {
        this.errorMessage = this.customErrorMessage;
      }
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  checkModified() {
    this.modified = this.value !== this.firstValue;
    this.onModifiedWithChanges.emit({
      modified: this.modified,
      value: this.inputFormControl.value,
    });
  }

  public getSwitchClass() {
    return {
      [`switch`]: true,
      [`${this.size}`]: true,
      [`switch__disabled`]: this.disabled,
      [`${this.type}`]: true,
      [`modified`]: this.modified,
    };
  }

  onToggleClicked(isLeft: boolean): void {
    if (this.value !== isLeft) {
      this.value = isLeft;
      this.onChange(this.value);
      this.toggleClick.emit(isLeft);
      this.checkModified();
    }
  }
}
