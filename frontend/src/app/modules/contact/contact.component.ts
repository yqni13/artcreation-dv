/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";
import { MailAPIService } from "../../api/services/mail.api.service";
import { Router, RouterModule } from "@angular/router";
import { DataShareService } from "../../shared/services/data-share.service";
import { filter, Subscription, tap } from "rxjs";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { CastAbstractToFormControlPipe } from "../../common/pipes/cast-abstracttoform-control.pipe";
import { SelectInputComponent } from "../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../common/components/form-components/textarea-input/textarea-input.component";
import  * as CustomValidators  from "../../common/helper/custom-validators";
import { TranslateModule } from "@ngx-translate/core";
import { NavigationService } from "../../shared/services/navigation.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { FloatPrecisionPipe } from "../../common/pipes/float-precision.pipe";
import { LoadingAnimationComponent } from "../../common/components/animation/loading/loading-animation.component";
import { AuthService } from "../../shared/services/auth.service";
import { GalleryAPIService } from "../../api/services/gallery.api.service";
import { GalleryItem } from "../../api/models/gallery-response.interface";
import { TextCaseOption } from '../../shared/enums/text-case.enum';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    imports: [
        CommonModule,
        CastAbstractToFormControlPipe,
        FormsModule,
        LoadingAnimationComponent,
        ReactiveFormsModule,
        RouterModule,
        SelectInputComponent,
        TextInputComponent,
        TextareaInputComponent,
        TranslateModule
    ],
    providers: [FloatPrecisionPipe]
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('submitButton') submitButton!: ElementRef;

    protected contactForm: FormGroup;
    protected hasSelectedParameters: boolean; 
    protected hasPriceValue: boolean;
    protected hasReferenceFromParams: boolean;
    protected isLoadingResponse: boolean;
    protected readonly: boolean;
    protected artworkPrice: number | null;
    protected selectedParams: Record<string, string>;
    protected selectedArtworkByRefNr: any;
    protected subjectOptions = SubjectOptions;
    protected textCaseOption = TextCaseOption;

    private subscriptionDataShare$: Subscription;
    private subscriptionHttpObservationMailSend$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private delay: any;

    constructor(
        private readonly httpObservation: HttpObservationService,
        private readonly dataShareService: DataShareService,
        private readonly galleryApi: GalleryAPIService,
        private readonly navigate: NavigationService,
        private readonly mailService: MailAPIService,
        private readonly auth: AuthService,
        private readonly fb: FormBuilder,
        private readonly router: Router
    ) {
        this.contactForm = new FormGroup({});
        this.hasSelectedParameters = false;
        this.hasPriceValue = false;
        this.hasReferenceFromParams = false;
        this.isLoadingResponse = false;
        this.readonly = true;
        this.artworkPrice = null;
        this.selectedParams = {}
        this.subscriptionDataShare$ = new Subscription(); 
        this.subscriptionHttpObservationMailSend$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.subscriptionDataShare$ = this.dataShareService.sharedData$.pipe(
            filter((x) => !!x), // double exclamation mark (!!) sets null/empty value to boolean (false) !!"" === false
            tap((data) => {
                if(this.navigate.getPreviousUrl().includes(data['referenceNr'])) {
                    this.checkParametersFromGallery(data);
                } else {
                    this.checkParametersFromGallery(null);
                }
        })).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap(async (response: any) => {
                if(this.auth.getExceptionList().includes(response.error.headers.error)) {
                    await this.delay(500); // delay after snackbar displays
                    this.httpObservation.setErrorStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.initEdit();
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationMailSend$ = this.httpObservation.emailStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.checkParametersFromGallery(null)
                    this.resetForm();
                    this.initForm();
                    this.httpObservation.setEmailStatus(false);
                    this.isLoadingResponse = false;
                }
                this.setButtonUsage(true);
            })
        ).subscribe();
    }

    private initForm() {
        this.contactForm = this.fb.group({
            subject: new FormControl('', Validators.required),
            referenceNr: new FormControl(''),
            price: new FormControl(''),
            email: new FormControl('', [Validators.required, Validators.email]),
            honorifics: new FormControl('', Validators.required),
            title: new FormControl(''),
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required)
        })
    }

    private initEdit() {
        this.initForm();
        this.contactForm.patchValue({
            subject: this.hasSelectedParameters ? this.selectedParams['subject'] : '',
            referenceNr: this.hasSelectedParameters ? this.selectedParams['referenceNr'] : '',
            price: this.hasSelectedParameters ? this.selectedParams['requestPrice'] : '',
            email: '',
            honorifics: '',
            title: '',
            firstName: '',
            lastName: '',
            message: ''
        });
    }

    private checkParametersFromGallery(data: Record<string, string> | null) {
        if(data !== null && data !== undefined &&
            (data['referenceNr'] !== '' && data['subject'] !== '')) {
            this.hasSelectedParameters = true;
            this.hasReferenceFromParams = true;
            this.hasPriceValue = data['requestPrice'] !== '' && data['requestPrice'] !== null ? true : false;
            this.readonly = true;
            this.selectedParams = data;
        } else {
            this.hasSelectedParameters = false;
            this.hasReferenceFromParams = false;
            this.readonly = true;
            this.selectedParams = {};
        }
    }

    configRefNrByType() {
        const subject = this.contactForm.get('subject')?.value;        
        if(subject === SubjectOptions.artOrder || subject === SubjectOptions.specificInformation) {
            this.contactForm.get('referenceNr')?.markAsUntouched();
            this.contactForm.get('referenceNr')?.setValidators([Validators.required, CustomValidators.invalidRefNrValidator(this.selectedArtworkByRefNr, this.contactForm.get('subject')?.value), CustomValidators.invalidRefNrLengthValidator()]);
            this.contactForm.get('referenceNr')?.markAsPristine();            
            this.contactForm.get('referenceNr')?.setValue('');
            this.contactForm.get('price')?.setValue(null);
            this.readonly = false;
        } else {
            this.contactForm.get('referenceNr')?.clearValidators();
            this.contactForm.get('referenceNr')?.setValidators(CustomValidators.invalidRefNrValidator(this.selectedArtworkByRefNr, this.contactForm.get('subject')?.value));
            this.contactForm.get('referenceNr')?.setValue('');
            this.contactForm.get('price')?.setValue(null);
            this.configRefNrByChanges();
            this.hasReferenceFromParams = false;
            this.readonly = true;
            this.selectedParams = {};
            this.hasSelectedParameters = false;
        }
    }

    configRefNrByChanges() {
        const refNr = this.contactForm.get('referenceNr')?.value;
        if(refNr === null || refNr.length !== 6) {
            this.selectedArtworkByRefNr = undefined;
            return;
        }

        if(this.selectedArtworkByRefNr === undefined ||
            (this.selectedArtworkByRefNr.reference_nr && this.selectedArtworkByRefNr.reference_nr !== refNr) ) {
            this.isLoadingResponse = true;
            this.galleryApi.setRefNrParam(refNr);
            this.galleryApi.sendGetByRefNrRequest().subscribe((response) => {
                const result = response.body?.body.data[0] ?? []
                this.selectedArtworkByRefNr = result;
                this.contactForm.get('referenceNr')?.clearValidators();
                this.contactForm.get('referenceNr')?.setValidators(CustomValidators.invalidRefNrValidator((result as GalleryItem), this.contactForm.get('subject')?.value));
                this.contactForm.get('referenceNr')?.setValue(refNr)
                this.contactForm.get('price')?.setValue(this.configPriceFormat((result as GalleryItem).price ?? null));
                this.isLoadingResponse = false;
            });
        }
    }

    private configPriceFormat(value: string | number | null): string | null {
        return value === null ? null : `EUR ${value as string}`;
    }

    async onSubmit() {
        this.contactForm.markAllAsTouched();

        if(this.contactForm.invalid) {
            return;
        }

        this.isLoadingResponse = true;
        this.setButtonUsage(false);
        await this.mailService.setMailData(this.contactForm.getRawValue());
        this.mailService.sendMail().subscribe();
    }

    setButtonUsage(enabled: boolean) {
        if(enabled) {
            this.submitButton.nativeElement.classList.remove('artdv-readonly');
        } else {
            this.submitButton.nativeElement.classList.add('artdv-readonly');
        }
    }

    resetForm() {
        Object.keys(this.contactForm.value).forEach((key) => {
            this.contactForm.get(key)?.setValue('');
            this.contactForm.get(key)?.markAsUntouched();
            this.contactForm.get(key)?.setErrors(null);
        })
    }

    ngOnDestroy() {
        this.subscriptionDataShare$.unsubscribe();
        this.subscriptionHttpObservationMailSend$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}