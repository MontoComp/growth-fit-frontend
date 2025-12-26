import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment-create.component.html',
  styleUrl: './payment-create.component.scss'
})
export class PaymentCreateComponent {
  private paymentsService = inject(PaymentsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clientId = this.route.snapshot.paramMap.get('clientId')!;
  amount!: number;
  paid_until = '';

  create() {
    this.paymentsService.createPayment({
      client_id: this.clientId,
      amount: this.amount,
      paid_until: this.paid_until
    }).subscribe(() => {
      this.router.navigate(['/clients', this.clientId, 'payments']);
    });
  }
}
