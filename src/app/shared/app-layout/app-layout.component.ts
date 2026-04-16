import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { filter, firstValueFrom } from 'rxjs';
import {
  EBreakpoints,
  EBreakpointsSizes,
} from '../../core/constants/breakpoints';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { cloneDeep } from 'lodash-es';
import { GrowthFitSidebarV2Component } from '../growth-fit-sidebar-v2/growth-fit-sidebar-v2.component';

const MenuModules = [
  {
    icon: 'dashboard',
    text: 'Panel',
    moduleName: 'dashboard',
    moduleRoute: 'dashboard',
  },
  {
    icon: 'gym',
    text: 'Gimnasios',
    moduleName: 'gyms',
    moduleRoute: 'gyms',
  },
];

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    NzDrawerModule,
    AppHeaderComponent,
    GrowthFitSidebarV2Component,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  public growthfitModules = [...MenuModules];
  public currentModule: any;
  public deviceSize = signal(EBreakpoints.LARGE);
  public size = EBreakpoints;
  public sideBarOpen = signal(false);

  public userData: any;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}
  public drawerVisible = signal(false);

  ngOnInit() {
    this.handleBreakPoint();
    this.updateCurretModule();
    this.listenChildRoutes();
  }

  updateCurretModule() {
    const currentFullPath = this.router.url;

    const baseRoute = currentFullPath.split('/')[1];

    const module = this.growthfitModules.find(
      (item) => item.moduleRoute === baseRoute
    );

    this.currentModule = cloneDeep(module);

    if (this.currentModule?.childs?.length > 0) {
      this.currentModule.childs.map((item: any) => {
        const childViewFullpath = `/${baseRoute}/${item.url}`;
        item.selected = currentFullPath.includes(childViewFullpath);
      });
    }

    console.log('!!', this.currentModule);
  }

  listenChildRoutes() {
    this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe((data) => {
      console.log('navigationend!!!', data);
      this.updateCurretModule();
    });
  }

  private handleBreakPoint(): void {
    this.breakpointObserver
      .observe([EBreakpointsSizes.SMALL, EBreakpointsSizes.MEDIUM, EBreakpointsSizes.LARGE])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[EBreakpointsSizes.LARGE]) {
          this.deviceSize.set(EBreakpoints.LARGE);
          this.sideBarOpen.set(true);
          this.drawerVisible.set(false);
        } else if (state.breakpoints[EBreakpointsSizes.MEDIUM]) {
          this.deviceSize.set(EBreakpoints.MEDIUM);
          this.sideBarOpen.set(true);
          this.drawerVisible.set(true);
        } else if (state.breakpoints[EBreakpointsSizes.SMALL]) {
          this.deviceSize.set(EBreakpoints.SMALL);
          this.sideBarOpen.set(true);
          this.drawerVisible.set(true);
        }
      });
  }

  sideBarChanged(sideBarOpen: boolean) {
    this.sideBarOpen.set(sideBarOpen);
  }

  toggleDrawer(value: boolean) {
    this.drawerVisible.set(value);
  }

  closeDrawer(): void {
    this.drawerVisible.set(false);
  }

  async logout() {
    try {
      //await firstValueFrom(this.authService.logout());
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('role_description');
      localStorage.removeItem('userData');

      await this.router.navigate(['/login']);
    } catch (error) {}
  }
}
