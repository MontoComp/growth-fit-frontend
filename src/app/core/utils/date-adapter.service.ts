import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Injectable()
export class NgbDateMomentAdapter extends NgbDateAdapter<string> {

  fromModel(value: string | null): NgbDateStruct | null {
    if (!value) return null;
    const m = moment(value, 'YYYY-MM-DD');
    return { year: m.year(), month: m.month() + 1, day: m.date() };
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    return moment({
      year: date.year,
      month: date.month - 1,
      day: date.day
    }).format('YYYY-MM-DD');
  }
}
