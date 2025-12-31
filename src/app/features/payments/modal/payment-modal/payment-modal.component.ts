import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentsService } from '../../../../core/services/payments.service';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import  moment from 'moment';
import { NgbDateMomentAdapter } from '../../../../core/utils/date-adapter.service';
import { NgbDateCustomParserFormatter } from '../../../../core/utils/date-format.service';
import { firstValueFrom } from 'rxjs';
import { PlansService } from '../../../../core/services/plans.service';

@Component({
  standalone: true,
  selector: 'app-payment-modal',
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateMomentAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  templateUrl: './payment-modal.component.html',
})
export class PaymentModalComponent {
  private fb = inject(FormBuilder);
  private paymentsService = inject(PaymentsService);
  private plansService = inject(PlansService);
  public activeModal = inject(NgbActiveModal);

  @Input() clientId!: string;
  @Input() gymId!: string;
  @Input() payment: any = null;

  isSaving = signal(false);
  isLoading = signal(false);

  plans: any[] = [];

  totalAmount = 0;
  paidUntil: any = null;

  form = this.fb.group({
    plan_id: [null, Validators.required],
    months: [1, [Validators.required, Validators.min(1)]],
    paid_from: ['', Validators.required],
  });

  ngOnInit() {
    this.getListPlans();

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

  getSelectedPlan() {
    return this.plans.find((p) => p.id === this.form.value.plan_id);
  }

  private calculate() {
    const { plan_id, months, paid_from } = this.form.value;

    const plan = this.plans.find((p) => p.id === plan_id);

    if (!plan || !months || !paid_from) {
      this.totalAmount = 0;
      this.paidUntil = null;
      return;
    }

    this.totalAmount = plan.price * months;

    const start = moment(this.form.value.paid_from, 'YYYY-MM-DD');
    const end = start.add(months, 'months');

    this.paidUntil = end;
  }

  save() {
    if (this.form.invalid || !this.paidUntil) return;

    this.isSaving.set(true);

    const payload = {
      clientid: this.clientId,
      planid: this.form.value.plan_id,
      months: this.form.value.months,
      paid_from: this.form.value.paid_from,
      paid_until: this.paidUntil,
      amount: this.totalAmount,
    };

    console.log('Payment payload:', payload);

    this.paymentsService.createPayment(payload).subscribe({
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
