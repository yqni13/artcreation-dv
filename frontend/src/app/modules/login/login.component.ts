import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CastAbstractToFormControlPipe } from "../../common/pipes/cast-abstracttoform-control.pipe";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
        CastAbstractToFormControlPipe,
        CommonModule,
        ReactiveFormsModule,
        TextInputComponent,
        TranslateModule
    ]
})
export class LoginComponent implements OnInit, AfterViewInit {

    @HostListener('window:keydown', ['$event'])
    loginOnEnter(event: KeyboardEvent) {
        if(event.key  === 'Enter') {
            this.onLogin();
        }
    }

    @ViewChild('loginButton') loginButton!: ElementRef;

    protected loginForm: FormGroup;
    protected isLoadingResponse: boolean;
    protected authorLink: string;

    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly translate: TranslateService,
    ) {
        this.loginForm = new FormGroup({});
        this.isLoadingResponse = false;
        this.authorLink = 'https://pixabay.com/de/users/tama66-1032521/';
    }

    ngOnInit() {
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
        this.auth.login().subscribe(() => {
            if(this.auth.isLoggedIn()) {
                this.router.navigate(['admin']);
            }
        })
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
}