import { CommonModule, DOCUMENT } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SupportAPIService } from "../../api/services/support.api.service";
import { SupportOption } from "../../api/enums/ticket-option.support.enum";
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
import { SupportFeedbackData, SupportTicketData } from "./support-form.interface";
import { SupportRatingResponse } from "../../api/interfaces/support.interface";
import { HttpResponse } from "@angular/common/http";

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
    protected ticketOption = SupportOption;
    protected deviceOption = SupportDeviceOption;
    protected messageLength: number;
    protected defaultRatingValue: number;
    protected resetRatingValue: EventEmitter<number>;

    private subscriptionHttpObservationSupport$: Subscription;
    private subscriptionHttpObservationFeedback$: Subscription;
    private subscriptionHttpObservationRating$: Subscription;
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
        this.defaultRatingValue = 5;
        this.resetRatingValue = new EventEmitter<number>();

        this.subscriptionHttpObservationSupport$ = new Subscription();
        this.subscriptionHttpObservationFeedback$ = new Subscription();
        this.subscriptionHttpObservationRating$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.window = this.document.defaultView;
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.subscriptionHttpObservationRating$ = this.httpObservation.ratingStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setRatingStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap(async (response: any) => {
                if(this.auth.getExceptionList().includes(response.error.headers.error)) {
                    await this.delay(500);
                    this.httpObservation.setErrorStatus(false);
                }
                this.isLoadingResponse = false;
            })
        ).subscribe();
        this.initEdit();
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationSupport$ = this.httpObservation.supportStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.delay(750);
                    this.reset();
                    this.httpObservation.setSupportStatus(false);
                    this.isLoadingResponse = false;
                }
                if(this.sendBtn) {
                    this.setButtonUseStatus(true);
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationFeedback$ = this.httpObservation.feedbackStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.delay(750);
                    this.reset();
                    this.httpObservation.setFeedbackStatus(false);
                    this.isLoadingResponse = false;
                }
                if(this.sendBtn) {
                    this.setButtonUseStatus(true);
                }
            })
        ).subscribe();
    }

    private initForm() {
        this.supportForm = this.fb.group({
            attachment: new FormControl(null, Validators.maxLength(5)),
            userEmail: new FormControl('', [Validators.required, Validators.email]),
            option: new FormControl(null, Validators.required),
            rating: new FormControl(null),
            device: new FormControl(null),
            os: new FormControl(null),
            browser: new FormControl(null),
            title: new FormControl(''),
            message: new FormControl(''),
            termFeedback: new FormControl(null)
        });
    }

    private initEdit() {
        this.initForm();
        this.supportForm.patchValue({
            attachment: null,
            userEmail: '',
            option: '',
            rating: this.defaultRatingValue,
            device: this.window.screen.width > 1024 ? SupportDeviceOption.COMPUTER : SupportDeviceOption.MOBILE,
            os: '',
            browser: '',
            title: '',
            message: '',
            termFeedback: true
        });
    }

    private async initRating() {
        this.isLoadingResponse = true;
        this.supportApi.sendRatingRequest().subscribe((data: HttpResponse<SupportRatingResponse>) => {
            if(data.body && data.body.rating_average) {
                this.resetRatingValue.emit(data.body.rating_average);
                this.defaultRatingValue = data.body.rating_average;
            }
            this.isLoadingResponse = false;
        })
    }

    async updateFormOnOptionChange(option: Event) {
        const element = option.currentTarget as HTMLInputElement;
        this.resetValidationsOnOptionChange(element.value as SupportOption);
        if(element.value === this.ticketOption.FEEDBACK) {
            this.resetRatingAutofill();
            await this.initRating();
        } else {
            this.supportForm.get('rating')?.setValue(undefined);
        }
    }

    getPlaceholderByDeviceSuggestion(): string {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.window.navigator.userAgent)) {
            return this.deviceOption.MOBILE;
        } else if(/Chrome/i.test(this.window.navigator.userAgent)) {
            return this.deviceOption.COMPUTER;
        } else {
            return this.deviceOption.OTHER;
        }
    }

    getRatingInput(input: HTMLInputElement) {
        this.supportForm.get('rating')?.setValue(+input);
    }

    getFeedbackTerm(event: Event) {
        const input = event.target as HTMLInputElement;
        this.supportForm.get('termFeedback')?.setValue(input.checked);
    }

    private setButtonUseStatus(isReady: boolean) {
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
        let data: any;
        if(this.supportForm.get('option')?.value === SupportOption.FEEDBACK) {
            data = this.toSupportFeedbackData(this.supportForm.getRawValue());
            this.supportApi.setFeedbackData(data);
            this.supportApi.sendFeedbackRequest().subscribe();
        } else {
            data = this.toSupportTicketData(this.supportForm.getRawValue());
            this.supportApi.setTicketData(data);
            this.supportApi.sendTicketRequest().subscribe();
        }
    }

    private toSupportTicketData(form: any): SupportTicketData {
        return {
            attachment: form.attachment,
            userEmail: form.userEmail,
            option: form.option,
            title: form.title,
            message: form.message,
            device: form.device,
            os: form.os,
            browser: form.browser,
        };
    }

    private toSupportFeedbackData(form: any): SupportFeedbackData {
        return {
            userEmail: form.userEmail,
            option: form.option,
            rating: form.rating,
            termFeedback: form.termFeedback,
            message: form.message
        };
    }

    private resetValidationsOnOptionChange(option: SupportOption) {
        if(option === SupportOption.FEEDBACK) {
            this.supportForm.get('message')?.clearValidators();
            this.supportForm.get('message')?.setValidators(Validators.maxLength(1000));
        } else {
            this.supportForm.get('message')?.clearValidators();
            this.supportForm.get('message')?.setValidators([Validators.required, Validators.maxLength(5000)]);
        }
    }

    private resetRatingAutofill() {
        this.resetRatingValue.emit(this.defaultRatingValue);
        this.supportForm.get('rating')?.setValue(this.defaultRatingValue);
    }

    reset() {
        this.initEdit();
        this.resetRatingValue.emit(this.defaultRatingValue);
        this.checkboxTermFeedback.nativeElement.checked = true;
        this.supportForm.markAsUntouched();
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationSupport$.unsubscribe();
        this.subscriptionHttpObservationFeedback$.unsubscribe();
        this.subscriptionHttpObservationRating$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}