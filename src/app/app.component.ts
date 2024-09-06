import { AfterViewInit, Component, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { CommonModule, DOCUMENT } from '@angular/common';

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
    FooterComponent
  ]
})
export class AppComponent implements AfterViewInit, OnDestroy{
  title = 'art-gallery-FE-only';

  private listenerDefault!: () => void;

  constructor(
    protected snackbarService: SnackbarMessageService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    //
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
