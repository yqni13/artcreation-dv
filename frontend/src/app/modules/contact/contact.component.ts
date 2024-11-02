/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";
import { MailService } from "../../shared/services/mail.service";
import { Router, RouterModule } from "@angular/router";
import { ArtworkOptions, ArtworkOptionsHandcraftOnly, ArtworkOptionsOrigORPrint, ArtworkOptionsPaintingOnly } from "../../shared/enums/artwork-option.enum";
import { DataShareService } from "../../shared/services/data-share.service";
import { filter, Subscription, tap } from "rxjs";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { CastAbstractToFormControlPipe } from "../../common/pipes/cast-abstracttoform-control.pipe";
import { SelectInputComponent } from "../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../common/components/form-components/textarea-input/textarea-input.component";
import { ReferenceCheckService } from "../../shared/services/reference-check.service";
import  * as CustomValidators  from "../../common/helper/custom-validators";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../shared/services/navigation.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";
import { FloatPrecisionPipe } from "../../common/pipes/float-precision.pipe";

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        CastAbstractToFormControlPipe,
        FormsModule,
        FloatPrecisionPipe,
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
    protected hasValidReferenceNr: boolean;
    protected hasReferenceFromParams: boolean;
    protected readonly: boolean;
    protected isOrigORPrint: boolean;
    protected hasPriceZero: boolean;
    protected artworkPrice: number | null;
    protected selectedParams: Record<string, string>;
    protected subjectOptions = SubjectOptions;
    protected artworkOptionsAll = ArtworkOptions;
    protected artworkOptionsOrigORPrint = ArtworkOptionsOrigORPrint;
    protected artworkOptionsHandcraftOnly = ArtworkOptionsHandcraftOnly;
    protected artworkOptionsPaintingOnly = ArtworkOptionsPaintingOnly;

    private subscriptionDataShare$: Subscription;
    private subscriptionHttpObservation$: Subscription;

    constructor(
        private httpObservationService: HttpObservationService,
        private snackbarService: SnackbarMessageService,
        private refCheckService: ReferenceCheckService,
        private floatPrecisionPipe: FloatPrecisionPipe,
        private dataShareService: DataShareService,
        private navigate: NavigationService,
        private translate: TranslateService,
        private mailService: MailService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.contactForm = new FormGroup({});
        this.hasSelectedParameters = false;
        this.hasValidReferenceNr = false;
        this.hasReferenceFromParams = false;
        this.readonly = true;
        this.isOrigORPrint = false;
        this.hasPriceZero = false;
        this.artworkPrice = null;
        this.selectedParams = {}
        this.subscriptionDataShare$ = new Subscription(); 
        this.subscriptionHttpObservation$ = new Subscription();
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

        this.initEdit();
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservation$ = this.httpObservationService.emailStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.checkParametersFromGallery(null)
                    this.resetForm();
                }

                this.setButtonUsage(true);
            })
        ).subscribe();
    }

    private initForm() {
        this.contactForm = this.fb.group({
            subject: new FormControl('', Validators.required),
            referenceNr: new FormControl(''),
            type: new FormControl(''),
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
            type: this.hasSelectedParameters ? this.selectedParams['type'] : '',
            price: '',
            email: '',
            honorifics: '',
            title: '',
            firstName: '',
            lastName: '',
            message: ''
        });
        this.reassignValidators();
        this.setPriceAndFormat(this.contactForm.get('referenceNr')?.value);
    }

    private reassignValidators() {
        // by overwriting form with params from gallery, need to reassign necessary validators (case originalORprint)
        this.contactForm.get('type')?.setValidators(Validators.required);
    }

    private checkParametersFromGallery(data: Record<string, string> | null) {
        if(data !== null && data !== undefined &&
            (data['referenceNr'] !== '' && data['type'] !== '' && data['subject'] !== '')) {
            this.hasSelectedParameters = true;
            this.hasReferenceFromParams = true;
            this.hasValidReferenceNr = true;
            this.readonly = true;
            this.selectedParams = data;
            this.hasPriceZero = !!data['requestPrice'];
            this.checkTypeParam(data['type'])            
        } else {
            this.hasSelectedParameters = false;
            this.hasReferenceFromParams = false;
            this.hasValidReferenceNr = false;
            this.readonly = false;
            this.selectedParams = {};
        }
    }

    private checkTypeParam(type: string) {
        if(type === ArtworkOptions.originalORprint) {
            this.setOrigORPrintFlag(true);
            this.selectedParams['type'] = '';
        } else {
            this.setOrigORPrintFlag(false);
        }
    }

    configRefNrByType() {
        const subject = this.contactForm.get('subject')?.value;        
        if(subject === SubjectOptions.artOrder || subject === SubjectOptions.specificInformation) {
            this.contactForm.get('referenceNr')?.markAsUntouched();
            this.contactForm.get('referenceNr')?.setValidators([Validators.required, CustomValidators.invalidRefNrValidator(this.refCheckService), CustomValidators.invalidRefNrLengthValidator()]);
            this.contactForm.get('referenceNr')?.markAsPristine();            
            this.contactForm.get('referenceNr')?.setValue('');
            this.contactForm.get('price')?.setValue(null);
            this.readonly = false;
        } else {
            this.contactForm.get('referenceNr')?.clearValidators();
            this.contactForm.get('referenceNr')?.setValidators(CustomValidators.invalidRefNrValidator(this.refCheckService));
            this.contactForm.get('referenceNr')?.setValue('');
            this.contactForm.get('price')?.setValue(null);
            this.configRefNrByChanges();
            this.hasReferenceFromParams = false;
            this.readonly = false;
            this.selectedParams = {};
            this.hasSelectedParameters = false;
        }
    }

    configRefNrByChanges() {
        const refNr = this.contactForm.get('referenceNr')?.value;
        if(refNr === null || refNr.length !== 6) {
            this.hasValidReferenceNr = false;
            return;
        }

        if(this.refCheckService.checkReferenceValidity(refNr)) {
            this.hasValidReferenceNr = true;
            const artworkOption = this.refCheckService.checkTypeByReference(refNr);
            this.setPriceAndFormat(refNr);

            // handle artworkOption 'originalORprint' seperately
            if(artworkOption === this.artworkOptionsAll.originalORprint) {
                this.setOrigORPrintFlag(true);
                this.contactForm.get('type')?.setValue('');
            } else {
                this.setOrigORPrintFlag(false);
                this.contactForm.get('type')?.setValue(artworkOption);
            }

            // handle not-for-sale artwork seperately
            if(this.contactForm.get('subject')?.value === SubjectOptions.artOrder && !this.refCheckService.checkSaleStatusByReference(refNr)) {
                this.contactForm.get('subject')?.setValue(this.subjectOptions.specificInformation);
                this.snackbarService.notify({
                    title: 'Only specific request available.',
                    text: 'Artwork is not for sale or has no price at the moment!',
                    autoClose: true,
                    type: SnackbarOption.info,
                    displayTime: 7500
                })
            }
        }        
    }

    configSubjectByChanges(event: any) {
        if(event.target?.value === SubjectOptions.generalRequest) {
            this.contactForm.get('type')?.removeValidators(Validators.required);
            this.contactForm.get('type')?.setErrors(null); // no error in this case for type required
        } else {
            this.contactForm.get('type')?.addValidators(Validators.required);
        }
    }

    configTypeByChanges(event: any) {
        this.contactForm.get('type')?.setValue(event.target?.value);
    }

    private setOrigORPrintFlag(flag: boolean) {
        this.isOrigORPrint = flag;
    }

    private setPriceAndFormat(reference: string) {
        const price = this.floatPrecisionPipe.transform(this.refCheckService.checkPriceByReference(reference), 2)
        this.contactForm.get('price')?.setValue(String('€ ' + price));
    }

    onSubmit() {
        this.contactForm.markAllAsTouched();

        if(this.contactForm.invalid) {
            return;
        }

        this.setButtonUsage(false);
        this.mailService.setMailData(this.contactForm.getRawValue());
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
        this.subscriptionHttpObservation$.unsubscribe();
    }
}