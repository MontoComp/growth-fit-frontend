import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentsService } from '../../../../core/services/payments.service';
import {
  NgbActiveModal,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgbDateMomentAdapter } from '../../../../core/utils/date-adapter.service';
import { NgbDateCustomParserFormatter } from '../../../../core/utils/date-format.service';
import { firstValueFrom } from 'rxjs';
import { PlansService } from '../../../../core/services/plans.service';

@Component({
  standalone: true,
  selector: 'app-payment-renew-modal',
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateMomentAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
  templateUrl: './payment-renew-modal.component.html',
})
export class PaymentRenewModalComponent {
  private fb = inject(FormBuilder);
  private paymentsService = inject(PaymentsService);
  private plansService = inject(PlansService);
  public activeModal = inject(NgbActiveModal);

  @Input() clientId!: string;
  @Input() gymId!: string;
  @Input() lastPayment: any = null;

  isSaving = signal(false);
  isLoading = signal(false);

  plans: any[] = [];

  totalAmount = 0;
  paidFrom: any = null;
  paidUntil: any = null;

  public isExpandedState = false;

  form = this.fb.group({
    months: [null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.getListPlans();
    this.getExpandedState();

    this.form.valueChanges.subscribe(() => {
      this.calculate();
    });
  }

  async getListPlans() {
    this.isLoading.set(true);
    try {
      const result = await firstValueFrom(this.plansService.getListPlans(this.gymId));
      this.plans = result;
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private getExpandedState() {
    if (!this.lastPayment) return;

    const today = moment().startOf('day');
    const until = moment(this.lastPayment.paid_until);

    this.isExpandedState = until.isSameOrAfter(today);
  }

  private calculate() {
    const { months } = this.form.value;
    if (!months) {
      this.totalAmount = 0;
      this.paidFrom = null;
      this.paidUntil = null;
      return;
    }

    const today = moment().startOf('day');
    const lastUntil = this.lastPayment?.paid_until ? moment(this.lastPayment.paid_until) : null;

    const start =
      lastUntil && lastUntil.isSameOrAfter(today)
        ? lastUntil.clone()//? lastUntil.clone().add(1, 'day')
        : today.clone();

    const end = start.clone().add(months, 'months');

    this.totalAmount = this.lastPayment?.plans.price * months;
    this.paidFrom = start.toDate();
    this.paidUntil = end.toDate();
  }

  save() {
    if (this.form.invalid) return;

    this.isSaving.set(true);

    const payload = {
      clientid: this.clientId,
      planid: this.lastPayment?.plans.id,
      months: this.form.value.months,
    };

    this.paymentsService.renewPayment(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.activeModal.close(true);
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  close() {
    this.activeModal.dismiss();
  }
}
