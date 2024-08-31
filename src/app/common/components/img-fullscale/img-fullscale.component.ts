import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'agal-imgfullscale',
    template: `
        <div class="agal-imgfullscale-wrapper" *ngIf="isActive">
            <img src="{{imgPath}}" alt="404-picture-not-found">
            <div class="agal-imgfullscale-exit">
                <i
                    class="icon-CloseX"
                    [attr.aria-disabled]="true"
                    (click)="closeFullscale(false)"
                    (keydown.enter)="closeFullscale(false)"
                ></i>
            </div>
        </div>
    `,
    styleUrl: "./img-fullscale.component.scss",
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class ImgFullscaleComponent {

    @Input() imgPath: string;
    @Input() isActive: boolean;

    @Output() fullscaleChanged = new EventEmitter<boolean>();

    constructor() {
        this.imgPath = '';
        this.isActive = false;
    }

    closeFullscale(flag: boolean) {
        this.isActive = flag;
        this.fullscaleChanged.emit(flag);
    }
}