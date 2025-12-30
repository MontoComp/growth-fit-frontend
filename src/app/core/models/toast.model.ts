import { Position } from "../constants/position.constant";


export interface ToastModel {
    customClass?: string;
    viewToast: boolean;
    message: string;
    viewIcon?: boolean;
    position: string;
    icon?: string;
    hideDelay?: number;
    viewCloseButton?: boolean;
    showButton?: boolean;
    type?: 'alert' | 'toast' | 'alert-v2';
}

abstract class ToastBase implements ToastModel {
    viewToast = true;
    message = '';
    viewIcon = true;
    position = Position.bottomLeft;
    icon = '';
    hideDelay = 3000;
    viewCloseButton = false;
}