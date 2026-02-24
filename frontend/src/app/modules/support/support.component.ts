import { CommonModule, DOCUMENT } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SupportAPIService } from "../../api/services/support.api.service";
import { SupportCreateTicketRequest } from "../../api/interfaces/support.interface";
import { SupportTicketOption } from "../../api/enums/ticket-option.support.enum";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { SelectInputComponent } from "../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../common/components/form-components/textarea-input/textarea-input.component";
import { CastAbstractToFormControlPipe } from "../../common/pipes/cast-abstracttoform-control.pipe";
import { SupportDeviceOption } from "../../api/enums/device-option.support.enum";
import { VarDirective } from "../../common/directives/ng-var.directive";
import { StarRatingComponent } from "../../common/components/star-rating/star-rating.component";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { AuthService } from "../../shared/services/auth.service";
import { LoadingAnimationComponent } from "../../common/components/animation/loading/loading-animation.component";

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrl: './support.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        TextInputComponent,
        SelectInputComponent,
        TextareaInputComponent,
        CastAbstractToFormControlPipe,
        VarDirective,
        StarRatingComponent,
        LoadingAnimationComponent
    ]
})
export class SupportComponent implements OnInit, AfterViewInit, OnDestroy{

    @ViewChild('checkboxTermFeedback') checkboxTermFeedback!: ElementRef;
    @ViewChild('sendBtn') sendBtn!: ElementRef;
    @ViewChild('resetBtn') resetBtn!: ElementRef;

    protected supportForm: FormGroup;
    protected isLoadingResponse: boolean;
    protected ticketOption = SupportTicketOption;
    protected deviceOption = SupportDeviceOption;
    protected messageLength: number;
    protected defaultFeedbackValue: number;
    protected resetFeedbackValue: EventEmitter<number>;

    private subscriptionHttpObservationSupport$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private window: any;
    private delay: any;

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private readonly supportApi: SupportAPIService,
        private readonly httpObservation: HttpObservationService,
    ) {
        this.supportForm = new FormGroup({});
        this.isLoadingResponse = false;
        this.messageLength = 5000;
        this.defaultFeedbackValue = 5;
        this.resetFeedbackValue = new EventEmitter<number>();

        this.subscriptionHttpObservationSupport$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.window = this.document.defaultView;
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap(async (response: any) => {
                if(this.auth.getExceptionList().includes(response.error.headers.error)) {
                    await this.delay(500);
                    this.httpObservation.setErrorStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();
        this.initEdit();
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationSupport$ = this.httpObservation.supportStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.reset();
                    this.httpObservation.setSupportStatus(false);
                    this.isLoadingResponse = false;
                }
                this.setButtonUseStatus(true);
            })
        ).subscribe();
    }

    private initForm() {
        this.supportForm = this.fb.group({
            attachment: new FormControl(null, Validators.maxLength(5)),
            userEmail: new FormControl('', [Validators.required, Validators.email]),
            option: new FormControl(null, Validators.required),
            feedback: new FormControl(null),
            device: new FormControl(null),
            os: new FormControl(null),
            browser: new FormControl(null),
            title: new FormControl(''),
            message: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
            termFeedback: new FormControl(null)
        });
    }

    private initEdit() {
        this.initForm();
        this.supportForm.patchValue({
            attachment: null,
            userEmail: '',
            option: '',
            feedback: this.defaultFeedbackValue,
            device: this.window.screen.width > 1024 ? SupportDeviceOption.DESKTOP : SupportDeviceOption.MOBILE,
            os: '',
            browser: '',
            title: '',
            message: '',
            termFeedback: true
        });
    }

    updateFormOnOptionChange(option: Event) {
        const element = option.currentTarget as HTMLInputElement;
        let title = '';
        if(element.value === this.ticketOption.FEEDBACK) {
            this.resetFeedbackAutofill();
            title = this.ticketOption.FEEDBACK;
        } else {
            const currentTitle = this.supportForm.get('title')?.value;
            title = currentTitle === this.ticketOption.FEEDBACK ? '' : currentTitle;
            this.supportForm.get('feedback')?.setValue(undefined);
        }
        this.supportForm.get('title')?.setValue(title);
    }

    getPlaceholderByDeviceSuggestion(): string {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.window.navigator.userAgent)) {
            return this.deviceOption.MOBILE;
        } else if(/Chrome/i.test(this.window.navigator.userAgent)) {
            return this.deviceOption.DESKTOP;
        } else {
            return this.deviceOption.OTHER;
        }
    }

    getFeedbackInput(input: HTMLInputElement) {
        this.supportForm.get('feedback')?.setValue(+input);
    }

    getFeedbackTerm(event: Event) {
        const input = event.target as HTMLInputElement;
        this.supportForm.get('termFeedback')?.setValue(input.checked);
    }

    setButtonUseStatus(isReady: boolean) {
        if(isReady) {
            this.sendBtn.nativeElement.classList.remove('artdv-readonly');
            this.resetBtn.nativeElement.classList.remove('artdv-readonly');
        } else {
            this.sendBtn.nativeElement.classList.add('artdv-readonly');
            this.resetBtn.nativeElement.classList.add('artdv-readonly');
        }
    }

    onSubmit() {
        this.supportForm.markAllAsTouched();
        if(this.supportForm.invalid) {
            return;
        }

        this.setButtonUseStatus(false);
        this.isLoadingResponse = true;
        const data: SupportCreateTicketRequest = this.supportForm.getRawValue();
        this.supportApi.setCreateTicketData(data);
        this.supportApi.sendCreateTicketRequest().subscribe();
    }

    private resetFeedbackAutofill() {
        this.resetFeedbackValue.emit(this.defaultFeedbackValue);
        this.supportForm.get('feedback')?.setValue(this.defaultFeedbackValue);
    }

    reset() {
        this.initEdit();
        this.resetFeedbackValue.emit(this.defaultFeedbackValue);
        this.checkboxTermFeedback.nativeElement.checked = true;
        this.supportForm.markAsUntouched();
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationSupport$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}