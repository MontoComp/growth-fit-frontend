import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.scss'
})
export class ClientCreateComponent {
  private clientsService = inject(ClientsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  gymId = this.route.snapshot.paramMap.get('gymId')!;
  name = '';
  phone = '';

  create() {
    if (!this.name) return;

    this.clientsService.createClient({
      gym_id: this.gymId,
      name: this.name,
      phone: this.phone
    }).subscribe(() => {
      this.router.navigate(['/gyms', this.gymId, 'clients']);
    });
  }
}
