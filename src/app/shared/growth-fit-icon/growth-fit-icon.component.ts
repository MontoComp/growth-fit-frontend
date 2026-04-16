import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  selector: 'growth-fit-icon',
  imports: [CommonModule],
  templateUrl: './growth-fit-icon.component.html',
  styleUrls: ['./growth-fit-icon.component.scss']
})
export class GrowthFitIconComponent {

  @Input() icon!: string;
  @Input() width?: number = 16;
  @Input() height?: number = 16;
  @Input() fill?: string;
  @Input() class?: string;

}