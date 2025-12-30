import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModel } from './core/models/toast.model';
import { ToastService } from './core/utils/toast.service';
import { CommonModule } from '@angular/common';
import { GeniaAlertV2Component } from './shared/genia-alert-v2/genia-alert-v2.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, GeniaAlertV2Component],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private toastService = inject(ToastService);

  protected readonly title = signal('web');
  toastModel = signal<ToastModel>({
    viewToast: false,
  } as ToastModel);

  ngOnInit(): void {
    this.getToastService();
  }

  private getToastService(): void {
    this.toastService.toast$.subscribe((toastModel: ToastModel) => {
      this.toastModel.set(toastModel);
    });
  }
}
