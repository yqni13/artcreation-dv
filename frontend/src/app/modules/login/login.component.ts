/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, viewChild } from "@angular/core";
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
    imports: [
        CastAbstractToFormControlPipe,
        CommonModule,
        LoadingAnimationComponent,
        ReactiveFormsModule,
        TextInputComponent,
        TranslateModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    host: {
        '(document:keydown.enter)': 'onLogin()'
    }
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly auth = inject(AuthService);
    private readonly httpObservation = inject(HttpObservationService);

    private readonly loginButton = viewChild.required<ElementRef>('loginButton');

    protected loginForm: FormGroup = new FormGroup({});
    protected isLoadingResponse = false;
    protected authorLink = 'https://pixabay.com/de/users/tama66-1032521/';

    private subscriptionHttpObservationLogin$ = new Subscription();
    private subscriptionHttpObservationError$ = new Subscription();
    private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
                    this.resetForm();
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
    }

    private initForm() {
        this.loginForm = this.fb.group({
            user: new FormControl(null, Validators.required),
            pass: new FormControl(null, Validators.required)
        });
    }

    private initEdit() {
        this.initForm();
        this.loginForm.patchValue({
            user: null,
            pass: null
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
                this.loginButton().nativeElement.classList.remove('artdv-readonly');
            } else {
                this.loginButton().nativeElement.classList.add('artdv-readonly');
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