import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { LoadingAnimationComponent } from './common/components/animation/loading/loading-animation.component';
import { AuthService } from './shared/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        CommonModule,
        RouterOutlet,
        LoadingAnimationComponent,
        NavigationComponent,
        SnackbarComponent,
        FooterComponent
    ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy{

  protected title = 'artcreation-dv';
  protected scrollbarActive: boolean;
  protected isNavigating: boolean;

  private scrollbarRoutes: string[];
  private listenerDefault!: () => void;
  private scrollAnchor!: HTMLElement;

  constructor(
    protected snackbarService: SnackbarMessageService,
    private readonly router: Router,
    private readonly elRef: ElementRef,
    private readonly renderer2: Renderer2,
    private readonly authService: AuthService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.scrollbarActive = false;
    this.scrollbarRoutes = [
      '/imprint',
      '/privacy'
    ];
    this.isNavigating = false;

    this.router.events.subscribe(e => {
      if(e instanceof NavigationStart) {
        this.isNavigating = true;
        this.scrollToTop();
        this.scrollbarActive = this.scrollbarRoutes.includes(e.url);
      } else if(e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        this.isNavigating = false;
      }
    })
  }

  ngOnInit() {
    this.scrollAnchor = this.elRef.nativeElement.querySelector(".artdv-scroll-anchor");
    this.authService.restoreExpirationTimer();
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
