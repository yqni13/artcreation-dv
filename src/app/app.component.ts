import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet, 
    NavigationComponent,
    SnackbarComponent,
    FooterComponent,
    TranslateModule
  ]
})
export class AppComponent implements AfterViewInit, OnDestroy{

  protected title = 'artcreation-dv';
  protected scrollbarActive: boolean;

  private scrollbarRoutes: string[];
  private listenerDefault!: () => void;
  private scrollAnchor: HTMLElement;

  constructor(
    protected snackbarService: SnackbarMessageService,
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private renderer2: Renderer2,
    private elRef: ElementRef,
    private router: Router
  ) {
    this.translate.setDefaultLang('de');

    this.scrollbarActive = false;
    this.scrollbarRoutes = [
      '/imprint',
      '/privacy',
      '/gallery'
    ];    
    this.scrollAnchor = this.elRef.nativeElement.querySelector(".agal-scroll-anchor");
    
    router.events.subscribe(e => {
      if(e instanceof NavigationStart) {
        this.scrollToTop();

        if(this.scrollbarRoutes.includes(e.url)) {
          this.scrollbarActive = true;
        } else {
          this.scrollbarActive = false;
        }
      }
    })
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
