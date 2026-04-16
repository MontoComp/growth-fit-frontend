import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { EBreakpoints } from '../../core/constants/breakpoints';
import { GrowthFitIconComponent } from '../growth-fit-icon/growth-fit-icon.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterOutlet, GrowthFitIconComponent, RouterModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  private authService = inject(AuthService);

  @ViewChild('userMenu') userMenu!: ElementRef<any>;
  @ViewChild('bannerTemplate', { read: TemplateRef })
  bannerTemplate!: TemplateRef<any>;

  @Input() public currentModule: any;
  @Input() public sideBarOpen: boolean = false;
  @Input() public deviceSize: EBreakpoints = EBreakpoints.LARGE;
  @Output() sideBarChange = new EventEmitter<any>();
  @Output() hamburgerClicked = new EventEmitter<any>();
  @Output() logoutClicked = new EventEmitter<any>();

  public size = EBreakpoints;
  public popupVisible = false;
  public userData: any;

  public hasRolAccessConfig: boolean = false;

  constructor(public dialog: Dialog) {}

  ngOnInit(): void {
    this.userData = this.authService.getUserDataFromStorage();
  }

  toggleSideBar() {
    const sideBarOpen = !this.sideBarOpen;
    this.sideBarChange.emit(sideBarOpen);
  }

  navigatetoUrl(item: any) {
    console.log('item', item);
  }

  toggleMenuPopup() {
    this.popupVisible = !this.popupVisible;

    setTimeout(() => {
      if (this.popupVisible) {
        this.userMenu.nativeElement.focus();
      }
    }, 10);
  }

  onBlur() {
    this.popupVisible = false;
  }
}
