import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GymsService } from '../../../core/services/gyms.service';

@Component({
  selector: 'app-gym-modal',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './gym-modal.component.html',
})
export class GymModalComponent {
  private gymsService = inject(GymsService);
  public activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);

  form: FormGroup;

  @Input() gym: any = null;
  isSaving = signal(false);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
    });
  }

  ngOnInit() {
    if (this.gym) {
      this.form.patchValue({
        name: this.gym.name,
        address: this.gym.address,
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    this.isSaving.set(true);

    const data = this.form.value;

    const request = this.gym
      ? this.gymsService.updateGym(this.gym.id, data)
      : this.gymsService.createGym(data);

    request.subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.activeModal.close(true);
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false)
      },
    });
  }

  close() {
    this.activeModal.dismiss(false);
  }
}
