import { environment } from './../../../environments/environment';
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CastAbstractToFormControlPipe } from "../../common/pipes/cast-abstracttoform-control.pipe";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { LoadingAnimationComponent } from "../../common/components/animation/loading/loading-animation.component";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../shared/services/http-observation.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
        CastAbstractToFormControlPipe,
        CommonModule,
        LoadingAnimationComponent,
        ReactiveFormsModule,
        TextInputComponent,
        TranslateModule
    ]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

    @HostListener('window:keydown', ['$event'])
    loginOnEnter(event: KeyboardEvent) {
        if(event.key === 'Enter') {
            this.onLogin();
        }
    }

    @ViewChild('loginButton') loginButton!: ElementRef;

    protected loginForm: FormGroup;
    protected isLoadingResponse: boolean;
    protected authorLink: string;

    private subscriptionHttpObservationLogin$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private delay: any;

    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly httpObservation: HttpObservationService
    ) {
        this.loginForm = new FormGroup({});
        this.isLoadingResponse = false;
        this.authorLink = 'https://pixabay.com/de/users/tama66-1032521/';

        this.subscriptionHttpObservationLogin$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.auth.preConnect().subscribe();
        this.subscriptionHttpObservationLogin$ = this.httpObservation.loginStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200 && this.auth.isLoggedIn()) {
                    this.isLoadingResponse = false;
                    this.router.navigate(['admin']);
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap(async (response: any) => {
                if(response.error.headers.error) {
                    await this.delay(500); // delay after snackbar displays
                    this.httpObservation.setErrorStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.initEdit();
    }

    ngAfterViewInit() {
        this.setButtonStatus(true);
        this.isLoadingResponse = false;
        this.resetForm();
    }

    private initForm() {
        this.loginForm = this.fb.group({
            user: new FormControl('', Validators.required),
            pass: new FormControl('', Validators.required)
        });
    }

    private initEdit() {
        this.initForm();
        this.loginForm.patchValue({
            user: '',
            pass: ''
        })
    }

    async onLogin() {
        this.loginForm.markAllAsTouched();

        if(this.loginForm.invalid) {
            return;
        }

        this.isLoadingResponse = true;
        this.setButtonStatus(false);
        await this.auth.setCredentials(
            this.loginForm.get('user')?.value,
            this.loginForm.get('pass')?.value
        );
        this.auth.login().subscribe();
    }

    private setButtonStatus(isEnabled: boolean) {
        if(this.loginButton) {
            if(isEnabled) {
                this.loginButton.nativeElement.classList.remove('artdv-readonly');
            } else {
                this.loginButton.nativeElement.classList.add('artdv-readonly');
            }
        }
    }

    private resetForm() {
        Object.keys(this.loginForm.value).forEach((key) => {
            this.loginForm.get(key)?.setValue('');
            this.loginForm.get(key)?.markAsUntouched();
            this.loginForm.get(key)?.setErrors(null);
        })
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationLogin$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}