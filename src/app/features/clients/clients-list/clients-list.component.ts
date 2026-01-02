import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';
import { firstValueFrom } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientModalComponent } from '../modal/client-modal.component';
import { CommonModule } from '@angular/common';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import moment from 'moment';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, NgbModule, NzSkeletonModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
})
export class ClientsListComponent implements OnInit {
  private modalService = inject(NgbModal);
  private clientsService = inject(ClientsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  gymId!: string;
  clients: any[] = [];
  isLoading = signal(false);

  selectedClient: any = null;

  ngOnInit() {
    console.log('Initializing ClientsListComponent');
    this.gymId = String(this.route.snapshot.paramMap.get('gymId'));
    this.loadClients();
  }

  async loadClients() {
    this.isLoading.set(true);
    try {
      const result = await firstValueFrom(
        this.clientsService.getClientsByGymWithStatus(this.gymId)
      );
      this.clients = result;
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  delete(client: any) {
    if (!confirm(`¿Eliminar el cliente "${client.name}"?`)) return;

    this.clientsService.deleteClient(client.id).subscribe(() => {
      this.loadClients();
    });
  }

  openModal(client: any = null) {
    this.selectedClient = client;

    const modalRef = this.modalService.open(ClientModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.client = client;
    modalRef.componentInstance.gymId = this.gymId;

    modalRef.closed.subscribe((refresh: boolean) => {
      if (refresh) this.loadClients();
    });
  }

  goToPayments(client: any) {
    this.router.navigate(['/gyms', this.gymId, 'clients', client.id, 'payments']);
  }

  goToGyms() {
    this.router.navigate(['/gyms']);
  }

  getRowsForSkeleton(rowTotal: number = 15) {
    return Array(rowTotal)
      .fill(0)
      .map((x, i) => i);
  }

  statusClass(status: string) {
    return {
      ACTIVE: 'badge-active',
      WARNING: 'badge-warning',
      EXPIRED: 'badge-expired',
    }[status];
  }

  statusLabel(item: any) {
    if (item.status === 'ACTIVE') {
      return `🟢 Activo (vence ${this.formatDate(item.paid_until)})`;
    }

    if (item.status === 'WARNING') {
      const days = this.daysLeft(item.paid_until);
      return `🟡 Por vencer (${days} ${days>1 ? 'días' : 'día'})`;
    }

    return '🔴 Inactivo';
  }

  daysLeft(date: string): number {
    if (!date) return 0;

    const today = moment().startOf('day');
    const target = moment(date, 'YYYY-MM-DD');

    return target.diff(today, 'days');
  }

  formatDate(date: string | null): string {
    if (!date) return '';

    return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }
}
