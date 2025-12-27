import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../../../core/services/payments.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { PaymentModalComponent } from '../modal/payment-modal.component';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss',
})
export class PaymentsListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentsService = inject(PaymentsService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  clientId!: string;
  gymId!: string;
  payments: any[] = [];
  isLoading = signal(false);
  selectedPayment: any = null;

  ngOnInit() {
    this.clientId = String(this.route.snapshot.paramMap.get('clientId'));
    this.gymId = String(this.route.snapshot.paramMap.get('gymId'));
    this.loadPayments();
  }

  async loadPayments() {
    this.isLoading.set(true);
    try {
      const result = await firstValueFrom(this.paymentsService.getPayments(this.clientId));
      this.payments = result;
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(payment: any = null) {
    this.selectedPayment = payment;

    const modalRef = this.modalService.open(PaymentModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.payment = payment;
    modalRef.componentInstance.clientId = this.clientId;

    modalRef.closed.subscribe((refresh: boolean) => {
      if (refresh) this.loadPayments();
    });
  }

  delete(payment: any) {
    if (!confirm('¿Eliminar pago?')) return;

    this.paymentsService.deletePayment(payment.id).subscribe(() => {
      this.loadPayments();
    });
  }

  goToGyms() {
    this.router.navigate(['/gyms']);
  }

  goToClients() {
    this.router.navigate(['/gyms', this.gymId, 'clients']);
  }
}
