import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Component({
    selector: 'artdv-imgfullscale',
    template: `
        <div 
            *ngIf="isActive"
            class="artdv-imgfullscale-wrapper" 
            [attr.aria-disabled]="true"
            (click)="closeFullscale(false)"
            (keydown.enter)="closeFullscale(false)" 
        >
            <img src="{{storageDomain + '/' + imgPath}}" alt="404-picture-not-found">
        </div>
    `,
    styleUrl: "./img-fullscale.component.scss",
    imports: [
        CommonModule
    ]
})
export class ImgFullscaleComponent {
    @HostListener('window:keydown', ['$event'])
    closeOnEscape(event: KeyboardEvent) {
        if(event.key === 'Escape') {
            this.closeFullscale(false);
        }
    }

    @Input() imgPath: string;
    @Input() isActive: boolean;

    protected storageDomain: string;

    @Output() fullscaleChanged = new EventEmitter<boolean>();

    constructor() {
        this.imgPath = '';
        this.isActive = false;
        this.storageDomain = environment.STORAGE_URL;
    }

    closeFullscale(flag: boolean) {
        this.isActive = flag;
        this.fullscaleChanged.emit(flag);
    }
}