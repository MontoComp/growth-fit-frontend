import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService } from '../../../core/services/clients.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-client-modal',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './client-modal.component.html'
})
export class ClientModalComponent implements OnInit {

  private clientsService = inject(ClientsService);
  public activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);

  form: FormGroup;

  @Input() gymId!: string;
  @Input() client: any = null;
  isSaving = signal(false);

  constructor() {
    this.form = this.fb.group({
    name: ['', Validators.required],
    email: [''],
    phone: [''],
    status: ['ACTIVE'],
  });
  }

  ngOnInit() {
    if (this.client) {
      this.form.patchValue({
        name: this.client.name,
        email: this.client.email,
        phone: this.client.phone,
        status: this.client.status,
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
    }

    const request = this.client
      ? this.clientsService.updateClient(this.client.id, payload)
      : this.clientsService.createClient(payload);

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
