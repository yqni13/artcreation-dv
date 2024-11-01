/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from "@angular/core";

@Directive({
    selector: '[artdvGalleryScroll]',
    standalone: true
})
export class GalleryScrollDirective implements OnInit {

    @Output() preload!: EventEmitter<boolean>;

    private bufferY: number;
    private loaded: boolean;

    constructor(
        private elRef: ElementRef,
    ) {
        this.preload = new EventEmitter<boolean>(false);
        this.bufferY = 700;
        this.loaded = false;
    }
    
    ngOnInit() {
        this.isLoading();
    }
    
    @HostListener('window:load', [])
    isLoading() {
        // using offsetTop because getBoundingClientRect() not working on first rendering
        const offsetTop = this.elRef.nativeElement.offsetTop;
        const clientHeight = this.elRef.nativeElement.ownerDocument.scrollingElement.clientHeight;
        if(!this.loaded && offsetTop <= (clientHeight + this.bufferY)) {
            this.preload.emit(true);
            this.loaded = true;
        }
    }

    @HostListener('window:wheel', [])
    isScrollingMouseWheel() {
        this.preloadOnScroll();
    }

    // not working for custom scrollbar
    @HostListener('window:scroll', [])
    isScrollingScrollbar() {
        this.preloadOnScroll();
    }

    @HostListener('window:keydown', ['$event'])
    isScrollingKeyEvent(event: KeyboardEvent) {
        if(event.key === 'PageUp' || event.key === 'PageDown' || event.key === 'Tab') {
            this.preloadOnScroll();
        }
    }

    @HostListener('window:touchmove', [])
    isScrollingTouchMove() {
        this.preloadOnScroll();
    }

    @HostListener('window:click', ['$event'])
    isRoutingGenre($event: any) {
        if($event.target.className === 'artdv-gallery-nav-type' && !this.loaded) {
            this.preloadOnScroll();
        }
    }

    preloadOnScroll() {
        const currentPositionY = this.elRef.nativeElement.getBoundingClientRect().y;
        const viewportHeight = this.elRef.nativeElement.ownerDocument.scrollingElement.clientHeight;
        if(!this.loaded && currentPositionY <= (viewportHeight + this.bufferY)) {
            this.preload.emit(true);
            this.loaded = true;
        }
    }
}