import { EventEmitter, Injectable } from "@angular/core";
import { ToastModel } from "../models/toast.model";

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toast$ = new EventEmitter<ToastModel>();

    constructor(){}
}