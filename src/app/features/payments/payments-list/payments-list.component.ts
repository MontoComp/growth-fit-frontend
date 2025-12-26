import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss'
})
export class PaymentsListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentsService = inject(PaymentsService);

  clientId!: string;
  payments: any[] = [];

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('clientId')!;
    this.loadPayments();
  }

  loadPayments() {
    this.paymentsService.getPayments(this.clientId).subscribe(data => {
      this.payments = data;
    });
  }

  newPayment() {
    this.router.navigate(['/clients', this.clientId, 'payments/create']);
  }
}
