import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexTooltip,
  ApexLegend
} from 'ng-apexcharts';
import { firstValueFrom } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  chartOptions: ChartOptions = {
    series: [
      {
        name: 'Ingresos',
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    },
    stroke: {
      curve: 'smooth',
    },
    dataLabels: {
      // <--- inicializado correctamente
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `$${val}`,
      },
    },
    title: {
      text: 'Ingresos Mensuales',
      align: 'left',
    },
  };

  stats = {
    gyms: 0,
    clients: 0,
    revenue: 0,
    activeClients: 0,
  };

  lastPayments: any[] = [];

  isLoading = signal(false);

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    this.isLoading.set(true);
    try {
        const result = await firstValueFrom(this.dashboardService.getMetrics());

        this.stats.gyms = result.stats.totalGyms;
        this.stats.clients = result.stats.totalClients;
        this.stats.activeClients = result.stats.pendingPayments;
        this.stats.revenue = result.lastPayments.reduce((sum: any, p: { amount: any; }) => sum + p.amount, 0);

        this.lastPayments = result.lastPayments;

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    } finally {
        this.isLoading.set(false);
    }
  }
}
