import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GymsService } from '../../../core/services/gyms.service';
import { GymModalComponent } from '../modal/gym-modal.component';
import { firstValueFrom } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gyms-list',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './gyms-list.component.html',
  styleUrl: './gyms-list.component.scss',
})
export class GymsListComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  private gymsService = inject(GymsService);
  private router = inject(Router);

  gyms: any[] = [];
  isLoading = signal(false);

  selectedGym: any = null;

  ngOnInit() {
    console.log('Initializing GymsListComponent');
    this.loadGyms();
  }

  async loadGyms() {
    this.isLoading.set(true);
    try {
      const result = await firstValueFrom(this.gymsService.getGyms());
      this.gyms = result;
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  delete(gym: any) {
    if (!confirm(`¿Eliminar el gimnasio "${gym.name}"?`)) return;

    this.gymsService.deleteGym(gym.id).subscribe(() => {
      this.loadGyms();
    });
  }

  openModal(gym: any = null) {
    this.selectedGym = gym;

    const modalRef = this.modalService.open(GymModalComponent, {
      size: 'lg', // modal grande
      backdrop: 'static', // no se cierra al hacer click afuera
    });
    modalRef.componentInstance.gym = gym;

    // escuchar cuando el modal se cierre
    modalRef.closed.subscribe((refresh: boolean) => {
      if (refresh) this.loadGyms();
    });
  }

  goToClients(gym: any) {
    this.router.navigate(['/gyms', gym.id, 'clients']);
  }

  ngOnDestroy() {
    console.log('Destroying GymsListComponent');
  }
}
