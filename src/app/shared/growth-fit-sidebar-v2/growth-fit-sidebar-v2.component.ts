import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Router, RouterModule } from "@angular/router";
import { EBreakpoints } from "../../core/constants/breakpoints";
import { CommonModule } from "@angular/common";
import { GrowthFitIconComponent } from "../growth-fit-icon/growth-fit-icon.component";


@Component({
    standalone: true,
  selector: 'growth-fit-sidebar-v2',
  imports: [CommonModule, GrowthFitIconComponent, RouterModule],
  templateUrl: './growth-fit-sidebar-v2.component.html',
  styleUrls: ['./growth-fit-sidebar-v2.component.scss']
})
export class GrowthFitSidebarV2Component implements OnInit {

  @Input() public modulo: string = 'test';
  @Input() public sideBarOpen: boolean = true;
  @Input() public isDrawer: boolean = false;
  
  @Input() public growthFitModules: any;
  @Input() public currentModule: any;
  @Input() public deviceSize = EBreakpoints.LARGE;
  public size = EBreakpoints;

  @Output() sideBarChange = new EventEmitter<any>();
  @Output() closeDrawer = new EventEmitter<any>();


  public hideSideMenu = false;
  public showSideMenu = false;

  constructor(private responsive: BreakpointObserver, public router: Router) {
  }

  ngOnInit() {
    this.responsive.observe([
      Breakpoints.Small,
      Breakpoints.XSmall,
      Breakpoints.HandsetLandscape,      
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait,
      Breakpoints.Tablet
    ])
    .subscribe(result => {
  
      this.hideSideMenu = false; 
      if (result.matches) {
        this.hideSideMenu = true;
      }
  
    });
  }

  toggleSideBar() {
    const sideBarOpen = !this.sideBarOpen;
    this.sideBarChange.emit(sideBarOpen);
  };

}