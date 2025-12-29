import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct | null {
    if (!value) return null;

    const parts = value.split('/');
    if (parts.length !== 3) return null;

    return {
      day: +parts[0],
      month: +parts[1],
      year: +parts[2],
    };
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    return `${this.pad(date.day)}/${this.pad(date.month)}/${date.year}`;
  }

  private pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
