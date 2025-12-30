import { Component, ElementRef, ViewChild, Input, OnInit, Renderer2, EventEmitter, Output } from '@angular/core';
import { Position } from '../../core/constants/position.constant';
import { ToastService } from '../../core/utils/toast.service';
import { ToastModel } from '../../core/models/toast.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'genia-alert-v2',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './genia-alert-v2.component.html',
    styleUrls: ['./genia-alert-v2.component.scss']
})
export class GeniaAlertV2Component implements OnInit {
    @Input() customClass?: string = '';
    @Input() message: string = '';
    @Input() icon?: string = '';
    @Input() viewIcon?: boolean = false;
    @Input() hideDelay?: number = 2000;
    @Input() position: string = Position.bottomLeft;
    @Input() appendToBody?: boolean = true;
    @Input() viewCloseButton?: boolean = false;
    @Input() showButton = false;

    @Output() clickAction = new EventEmitter<boolean>();

    @ViewChild("toast") element: ElementRef | undefined;

    constructor(
        private renderer: Renderer2,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        if (this.hideDelay && this.hideDelay > 0) {
            this.hideToast(this.hideDelay);
        }
    }

    hideToast(delay: number): void {
        setTimeout(() => {
            this.renderer.addClass(this.element?.nativeElement, "toast--hide");
            this.hideServiceToast();
        }, delay)
    }

    private hideServiceToast(): void {
        const toastModel: ToastModel = {
            viewToast: false,
            viewIcon: false,
            message: '',
            position: Position.bottomLeft
        }
        this.toastService.toast$.emit(toastModel);
    }

    handleAction() {
        this.clickAction.emit(true);
    }
}