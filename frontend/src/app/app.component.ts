import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        CommonModule,
        RouterOutlet,
        NavigationComponent,
        SnackbarComponent,
        FooterComponent
    ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy{

  protected title = 'artcreation-dv';
  protected scrollbarActive: boolean;

  private scrollbarRoutes: string[];
  private listenerDefault!: () => void;
  private scrollAnchor!: HTMLElement;

  constructor(
    protected snackbarService: SnackbarMessageService,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private elRef: ElementRef,
    private router: Router
  ) {
    this.scrollbarActive = false;
    this.scrollbarRoutes = [
      '/imprint',
      '/privacy'
    ];

    this.router.events.subscribe(e => {
      if(e instanceof NavigationEnd) {
        setTimeout(() => {
          this.scrollToTop();
          this.scrollbarActive = this.scrollbarRoutes.includes(e.urlAfterRedirects);
        })
      }
    })
  }

  ngOnInit() {
    this.scrollAnchor = this.elRef.nativeElement.querySelector(".artdv-scroll-anchor");
  }

  scrollToTop() {
    if(this.scrollAnchor && this.document.scrollingElement !== null) {
      this.scrollAnchor.scrollTo(0,0);
      // need to kill the y-offset caused by navbar in mobile mode
      this.document.scrollingElement.scrollTop = 0;
    }
  }

  ngAfterViewInit() {
    // disable right click event to prevent image copying
    // to disable right click for single element, use viewchild and this."viewchildname".nativeElement instead document
    this.listenerDefault = this.renderer2.listen(this.document, "contextmenu", function(e) {
      e.preventDefault();
    });
  }

  ngOnDestroy() {
    this.listenerDefault();
  }
}
