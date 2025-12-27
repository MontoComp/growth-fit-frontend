import { CommonModule } from "@angular/common";
import { Component, inject, Input, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { PaymentsService } from "../../../core/services/payments.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: true,
  selector: 'app-payment-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-modal.component.html'
})
export class PaymentModalComponent {
  private fb = inject(FormBuilder);
  private paymentsService = inject(PaymentsService);
  public activeModal = inject(NgbActiveModal);

  @Input() clientId!: string;
  @Input() payment: any = null;

  isSaving = signal(false);

  form = this.fb.group({
    amount: [0, Validators.required],
    paid_from: ['', Validators.required],
    paid_until: ['', Validators.required],
  });

  ngOnInit() {
    if (this.payment) {
      this.form.patchValue(this.payment);
    }
  }

  save() {
    if (this.form.invalid) return;

    this.isSaving.set(true);

    const payload = {
      ...this.form.value,
      clientid: this.clientId,
      status: this.calculateStatus()
    };

    console.log('Saving payment with payload:', payload);

    const req = this.payment
      ? this.paymentsService.updatePayment(this.payment.id, payload)
      : this.paymentsService.createPayment(payload);

    req.subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.activeModal.close(true);
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
      },
    });
  }

  calculateStatus() {
    const today = new Date();
    const until = new Date(this.form.value.paid_until!);
    return until < today ? 'EXPIRED' : 'PAID';
  }

  close() {
    this.activeModal.dismiss();
  }
}
