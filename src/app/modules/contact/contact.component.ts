import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";
import { MailService } from "../../shared/services/mail.service";
import { ErrorService } from "../../shared/services/error.service";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ArtworkOptions } from "../../shared/enums/artwork-option.enum";
import { DataShareService } from "../../shared/services/data-share.service";
import { filter, Subscription, tap } from "rxjs";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { CastAbstractToFormControlPipe } from "../../common/pipes/cast-abstracttoform-control.pipe";
import { SelectInputComponent } from "../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../common/components/form-components/textarea-input/textarea-input.component";
import { ReferenceCheckService } from "../../shared/services/reference-check.service";
import  * as CustomValidators  from "../../common/helper/custom-validators";

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
    ]
})
export class ContactComponent implements OnInit, OnDestroy {

    protected contactForm: FormGroup;
    protected hasSelectedParameters: boolean; 
    protected hasValidReferenceNr: boolean;
    protected hasReferenceFromParams: boolean;
    protected readonly: boolean;
    protected selectedParams: Record<string, string>;
    protected subjectOptions = SubjectOptions;
    protected artworkOptions = ArtworkOptions;

    private subscription$: Subscription;

    constructor(
        private refCheckService: ReferenceCheckService,
        private dataShareService: DataShareService,
        private errorService: ErrorService,
        private mailService: MailService,
        private router: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.contactForm = new FormGroup({});
        this.hasSelectedParameters = false;
        this.hasValidReferenceNr = false;
        this.hasReferenceFromParams = false;
        this.readonly = true;
        this.selectedParams = {}
        this.subscription$ = new Subscription();
    }
    
    ngOnInit() {
        this.subscription$ = this.dataShareService.sharedData$.pipe(
            filter((x) => !!x), // double exclamation mark (!!) => boolean check !!"" === false
            tap((data) => {
            this.checkParameters(data);           
        })).subscribe();

        this.initEdit();
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
            subject: this.hasSelectedParameters ? SubjectOptions.artOrder : '',
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

    private checkParameters(data: Record<string, string>) {
        if(data !== null || data !== undefined || (data['referenceNr'] !== '' && data['type'] !== '')) {
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

        this.mailService.setMailData(this.contactForm.getRawValue());
        this.mailService.sendMail().subscribe();
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}