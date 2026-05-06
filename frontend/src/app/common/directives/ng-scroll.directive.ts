import { Directive, ElementRef, inject, OnInit, output } from "@angular/core";

@Directive({
    selector: '[artdvGalleryScroll]',
    host: {
        '(window:load)': 'isLoading()',
        '(window:wheel)': 'preloadOnScroll()',
        '(window:scroll)': 'preloadOnScroll()',
        '(window:touchmove)': 'preloadOnScroll()',
        '(window:click)': 'isRoutingGenre($event)',
        '(window:keydown)': 'isScrollingKeyEvent($event)'
    }
})
export class GalleryScrollDirective implements OnInit {

    private readonly elRef = inject(ElementRef);

    // @Output() preload!: EventEmitter<boolean>;
    readonly preload = output<boolean>();

    private bufferY = 700;
    private loaded = false;

    ngOnInit() {
        this.isLoading();
    }

    isLoading() {
        // using offsetTop because getBoundingClientRect() not working on first rendering
        const offsetTop = this.elRef.nativeElement.offsetTop;
        const clientHeight = this.elRef.nativeElement.ownerDocument.scrollingElement.clientHeight;
        if(!this.loaded && offsetTop <= (clientHeight + this.bufferY)) {
            this.preload.emit(true);
            this.loaded = true;
        }
    }

    isScrollingKeyEvent(event: KeyboardEvent) {
        if(event.key === 'PageUp' || event.key === 'PageDown' || event.key === 'Tab') {
            this.preloadOnScroll();
        }
    }

    isRoutingGenre(event: MouseEvent) {
        if((event.target as HTMLElement).className === 'artdv-gallery-nav-type' && !this.loaded) {
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