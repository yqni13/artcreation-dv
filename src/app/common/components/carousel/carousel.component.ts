/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class CarouselComponent {
    // @Input() slides: any;
    @Input() slides: { image?: string, title?: string, text?: string }[];
    @Input() slideTemplate?: TemplateRef<any>;

    currentIndex: number;

    constructor() {
        this.slides = [];
        this.currentIndex = 0;
    }

    getTransform() {
        return `translateX(${-this.currentIndex * 100}%)`;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }
}
