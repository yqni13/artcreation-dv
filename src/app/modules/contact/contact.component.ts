/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";
import { MailService } from "../../shared/services/mail.service";
import { Router, RouterModule } from "@angular/router";
import { ArtworkOptions } from "../../shared/enums/artwork-option.enum";
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

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        CastAbstractToFormControlPipe,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SelectInputComponent,
        TextInputComponent,
        TextareaInputComponent,
        TranslateModule
    ]
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('submitButton') submitButton!: ElementRef;

    protected contactForm: FormGroup;
    protected hasSelectedParameters: boolean; 
    protected hasValidReferenceNr: boolean;
    protected hasReferenceFromParams: boolean;
    protected readonly: boolean;
    protected selectedParams: Record<string, string>;
    protected subjectOptions = SubjectOptions;
    protected artworkOptions = ArtworkOptions;

    private subscriptionDataShare$: Subscription;
    private subscriptionHttpObservation$: Subscription;

    constructor(
        private httpObservationService: HttpObservationService,
        private refCheckService: ReferenceCheckService,
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
        this.selectedParams = {}
        this.subscriptionDataShare$ = new Subscription(); 
        this.subscriptionHttpObservation$ = new Subscription(); 
    }
    
    ngOnInit() {
        this.subscriptionDataShare$ = this.dataShareService.sharedData$.pipe(
            filter((x) => !!x), // double exclamation mark (!!) sets null/empty value to boolean (false) !!"" === false
            tap((data) => {
                if(this.navigate.getPreviousUrl().includes(data['referenceNr'])) {
                    this.checkParameters(data);
                } else {
                    this.checkParameters(null);
                }
        })).subscribe();

        

        this.initEdit();
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservation$ = this.httpObservationService.emailStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatusOK: boolean) => {
                if(isStatusOK) {
                    this.checkParameters(null)
                    this.initForm();
                }

                this.setButtonStatus(true);
            })
        ).subscribe();
    }
    
    private initForm() {
        this.contactForm = this.fb.group({
            subject: new FormControl('', Validators.required),
            referenceNr: new FormControl(''),
            type: new FormControl(''),
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
            email: '',
            honorifics: '',
            title: '',
            firstName: '',
            lastName: '',
            message: ''
        })
    }

    private checkParameters(data: Record<string, string> | null) {
        if(data !== null && data !== undefined &&
            (data['referenceNr'] !== '' && data['type'] !== '' && data['subject'] !== '')) {
            this.hasSelectedParameters = true;
            this.hasReferenceFromParams = true;
            this.hasValidReferenceNr = true;
            this.readonly = true;
            this.selectedParams = data;
        } else {
            this.hasSelectedParameters = false;
            this.hasReferenceFromParams = false;
            this.hasValidReferenceNr = false;
            this.readonly = false;
            this.selectedParams = {};
        }
    }

    configRefNrByType() {
        const subject = this.contactForm.get('subject')?.value;        
        if(subject === SubjectOptions.artOrder || subject === SubjectOptions.specificInformation) {
            this.contactForm.get('referenceNr')?.markAsUntouched();
            this.contactForm.get('referenceNr')?.setValidators([Validators.required, CustomValidators.invalidRefNrValidator(this.refCheckService)]);
            this.contactForm.get('referenceNr')?.markAsPristine();            
            this.contactForm.get('referenceNr')?.setValue('');
            this.readonly = false;
        } else {
            this.contactForm.get('referenceNr')?.clearValidators();
            this.contactForm.get('referenceNr')?.setValidators(CustomValidators.invalidRefNrValidator(this.refCheckService));
            this.contactForm.get('referenceNr')?.setValue('');
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
            this.contactForm.get('type')?.setValue(this.refCheckService.checkTypeByReference(refNr));
        }        
    }

    configRefNrOnSubmit() {
        // add this validator only on submit to avoid permanent validation in length check
        this.contactForm.get('referenceNr')?.addValidators(CustomValidators.invalidRefNrLengthValidator());
        const activateValidator = this.contactForm.get('referenceNr')?.value;
        this.contactForm.get('referenceNr')?.setValue('');
        this.contactForm.get('referenceNr')?.setValue(activateValidator);
    }

    onSubmit() {
        this.configRefNrOnSubmit();
        this.contactForm.markAllAsTouched();

        if(this.contactForm.invalid) {
            return;
        }

        this.setButtonStatus(false);
        this.mailService.setMailData(this.contactForm.getRawValue());
        this.mailService.sendMail().subscribe();
    }

    setButtonStatus(enabled: boolean) {
        if(enabled) {
            this.submitButton.nativeElement.classList.remove('agal-readonly');
        } else {
            this.submitButton.nativeElement.classList.add('agal-readonly');
        }
    }

    ngOnDestroy() {
        this.subscriptionDataShare$.unsubscribe();
        this.subscriptionHttpObservation$.unsubscribe();
    }
}