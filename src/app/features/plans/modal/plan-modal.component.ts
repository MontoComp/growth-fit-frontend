import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlansService } from '../../../core/services/plans.service';


@Component({
  selector: 'app-plan-modal',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './plan-modal.component.html'
})
export class PlanModalComponent implements OnInit {

  private plansService = inject(PlansService);
  public activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);

  form: FormGroup;

  @Input() gymId!: string;
  @Input() plan: any = null;
  isSaving = signal(false);

  constructor() {
    this.form = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
  });
  }

  ngOnInit() {
    if (this.plan) {
      this.form.patchValue({
        name: this.plan.name,
        price: this.plan.price,
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    this.isSaving.set(true);

    const data = this.form.value;

    const payload = {
        ...data,
        gymid: this.gymId,
        duration_months: 1,
    }

    const request = this.plan
      ? this.plansService.updatePlan(this.plan.id, payload)
      : this.plansService.createPlan(payload);

    request.subscribe({
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

  close() {
    this.activeModal.dismiss(false);
  }
}
