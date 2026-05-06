import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { LoadingAnimationComponent } from './common/components/animation/loading/loading-animation.component';
import { AuthService } from './shared/services/auth.service';
import { NavigationService } from './shared/services/navigation.service';

@Component({
	selector: 'app-root',
	imports: [
		CommonModule,
		RouterOutlet,
		LoadingAnimationComponent,
		NavigationComponent,
		SnackbarComponent,
		FooterComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

	private readonly router = inject(Router);
	private readonly elRef = inject(ElementRef);
	private readonly renderer2 = inject(Renderer2);
	private readonly authService = inject(AuthService);
	private readonly navigate = inject(NavigationService);
	protected readonly snackbarService = inject(SnackbarMessageService);

	protected title = 'artcreation-dv';
	protected scrollbarActive = false;
	protected isNavigating = false;

	private scrollbarRoutes: string[] = ['/imprint', '/privacy'];
	private listenerDefault!: () => void;
	private scrollAnchor!: HTMLElement;

	ngOnInit() {
		this.router.events.subscribe(e => {
			if(e instanceof NavigationStart) {
				this.isNavigating = true;
				this.navigateToTop();
				this.scrollbarActive = this.scrollbarRoutes.includes(e.url);
			} else if(e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
				this.isNavigating = false;
			}
		})

		this.scrollAnchor = this.elRef.nativeElement.querySelector(".artdv-scroll-anchor");
		this.authService.restoreExpirationTimer();
	}

	ngAfterViewInit() {
		// disable right click event to prevent image copying
		// to disable right click for single element, use viewchild and this."viewchildname".nativeElement instead document
		this.listenerDefault = this.renderer2.listen(document, "contextmenu", function(e) {
		e.preventDefault();
		});
	}

	navigateToTop() {
		this.navigate.scrollToTop(this.scrollAnchor, document);
	}

	ngOnDestroy() {
		this.listenerDefault();
	}
}
