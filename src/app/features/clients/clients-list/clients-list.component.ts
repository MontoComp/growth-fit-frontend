import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientsService = inject(ClientsService);

  gymId!: string;
  clients: any[] = [];

  ngOnInit() {
    this.gymId = this.route.snapshot.paramMap.get('gymId')!;
    this.loadClients();
  }

  loadClients() {
    this.clientsService.getClientsByGym(this.gymId).subscribe(data => {
      this.clients = data;
    });
  }

  openPayments(client: any) {
    this.router.navigate(['/clients', client.id, 'payments']);
  }

  createClient() {
    this.router.navigate(['/gyms', this.gymId, 'clients/create']);
  }
}
