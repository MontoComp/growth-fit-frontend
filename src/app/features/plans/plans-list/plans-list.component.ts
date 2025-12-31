import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { PlansService } from '../../../core/services/plans.service';
import { PlanModalComponent } from '../modal/plan-modal.component';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [CommonModule, NgbModule, NzSkeletonModule],
  templateUrl: './plans-list.component.html',
  styleUrl: './plans-list.component.scss',
})
export class PlansListComponent implements OnInit {
  private modalService = inject(NgbModal);
  private plansService = inject(PlansService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  gymId!: string;
  plans: any[] = [];
  isLoading = signal(false);

  selectedPlan: any = null;

  ngOnInit() {
    console.log('Initializing PlansListComponent');
    this.gymId = String(this.route.snapshot.paramMap.get('gymId'));
    this.loadPlans();
  }

  async loadPlans() {
    this.isLoading.set(true);
    try {
      const result = await firstValueFrom(this.plansService.getListPlans(this.gymId));
      this.plans = result;
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  delete(plan: any) {
    if (!confirm(`¿Eliminar el plan "${plan.name}"?`)) return;

    this.plansService.deletePlan(plan.id).subscribe(() => {
      this.loadPlans();
    });
  }

  openModal(plan: any = null) {
    this.selectedPlan = plan;

    const modalRef = this.modalService.open(PlanModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.plan = plan;
    modalRef.componentInstance.gymId = this.gymId;

    modalRef.closed.subscribe((refresh: boolean) => {
      if (refresh) this.loadPlans();
    });
  }

  goToPayments(client: any) {
    this.router.navigate(['/gyms', this.gymId, 'clients', client.id, 'payments']);
  }

  goToGyms() {
    this.router.navigate(['/gyms']);
  }

  getRowsForSkeleton(rowTotal: number = 15) {
    return Array(rowTotal).fill(0).map((x,i)=>i);
  }

}
