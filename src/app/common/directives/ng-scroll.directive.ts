/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from "@angular/core";

@Directive({
    selector: '[agalGalleryScroll]',
    standalone: true
})
export class GalleryScrollDirective implements OnInit {

    @Output() preload!: EventEmitter<boolean>;

    private bufferY: number;
    private loaded: boolean;

    constructor(private elRef: ElementRef) {
        this.preload = new EventEmitter<boolean>(false);
        this.bufferY = 1000;
        this.loaded = false;
    }
    
    ngOnInit() {
        this.isLoading();
    }
    
    @HostListener('window:load', [])
    isLoading() {
        // using offsetTop because getBoundingClientRect() not working in constructor
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

    @HostListener('window:touchmove', [])
    isScrollingTouchMove() {
        this.preloadOnScroll();
    }

    @HostListener('window:click', ['$event'])
    isRoutingGenre($event: any) {
        // console.log("event: ", $event);
        if($event.target.className === 'agal-gallery-nav-type' && !this.loaded) {
            this.isLoading();
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