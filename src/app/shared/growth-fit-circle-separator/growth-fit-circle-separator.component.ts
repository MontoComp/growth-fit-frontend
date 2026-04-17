import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'growth-fit-circle-separator',
  imports: [CommonModule],
  templateUrl: './growth-fit-circle-separator.component.html',
  styleUrls: ['./growth-fit-circle-separator.component.scss'],
})
export class GrowthFitCircleSeparatorComponent implements OnInit {
  @Input() quantity: number = 4;
  @Input() marginBotton: number = 2;
  @Input() color: string = '#DBDDE6';

  public numbers: Array<number> = [];

  ngOnInit(): void {
    this.numbers = Array(this.quantity)
      .fill(1)
      .map((x, i) => i + 1);
  }
}
