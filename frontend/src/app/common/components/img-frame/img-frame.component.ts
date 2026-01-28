import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ArtFrame } from "../../../shared/enums/art-frame.enum";

@Component({
    selector: 'artdv-imgframe',
    templateUrl: './img-frame.component.html',
    styleUrl: './img-frame.component.scss',
    imports: [
        CommonModule
    ]
})
export class ImgFrameComponent {

    @Input() model: ArtFrame;
    @Input() color: string;

    protected ArtFrameEnum = ArtFrame;

    constructor() {
        this.model = ArtFrame.DEFAULT;
        this.color = '#ffffff';
    }

    private mapLightenHex2Rgb(hex: string, ratio: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, ((num >> 16) & 0xff) + 255 * ratio);
        const g = Math.min(255, ((num >> 8) & 0xff) + 255 * ratio);
        const b = Math.min(255, (num & 0xff) + 255 * ratio);

        return `rgb(${r}, ${g}, ${b})`;
    }

    get artFramePhotoBorderStyles() {
        return {
            'border-top-color': this.mapLightenHex2Rgb(this.color, 0.2),
            'border-right-color': this.mapLightenHex2Rgb(this.color, 0),
            'border-bottom-color': this.mapLightenHex2Rgb(this.color, 0.2),
            'border-left-color': this.mapLightenHex2Rgb(this.color, 0),
        };
    }
}