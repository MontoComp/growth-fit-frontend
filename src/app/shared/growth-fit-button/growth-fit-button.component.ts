import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GrowthFitIconComponent } from '../growth-fit-icon/growth-fit-icon.component';

@Component({
  standalone: true,
  selector: 'growth-fit-button',
  imports: [CommonModule, GrowthFitIconComponent],
  templateUrl: './growth-fit-button.component.html',
  styleUrls: ['./growth-fit-button.component.scss'],
})
export class GrowthFitButtonComponent implements OnInit {
  @Input() text: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type:
    | 'primary'
    | 'primary-purple'
    | 'secondary'
    | 'tertiary'
    | 'secondary-purple'
    | 'tertiary-teal'
    | 'secondary-teal'
    | 'primary-teal'
    | 'tertiary-crimson'
    | 'tertiary-midnight'
    | 'tertiary-purple' = 'primary';
  @Input() disabled: boolean = false;
  @Input() iconName: string = '';
  @Input() paddingLeftRight: string = '';

  @Output() onClick = new EventEmitter<boolean>(false);

  public iconSize: number = 12;

  constructor() {}

  ngOnInit() {
    this.setIconSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setIconSize();
  }

  private setIconSize(): void {
    switch (this.size) {
      case 'small':
        this.iconSize = 10;
        break;
      case 'medium':
        this.iconSize = 12;
        break;
      case 'large':
        this.iconSize = 16;
        break;
      default:
        this.iconSize = 12;
    }
  }

  getClassButton(): Object {
    return {
      ['growth-fit-button--' + this.size]: true,
      ['growth-fit-button--' + this.type]: true,
    };
  }

  getStyleButton(): Object {
    return {
      ['padding']: this.text ? (this.paddingLeftRight ? this.paddingLeftRight : null) : '8px',
    };
  }
}
