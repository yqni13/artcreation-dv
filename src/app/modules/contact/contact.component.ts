import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";
import { MailService } from "../../shared/services/mail.service";
import { ErrorService } from "../../shared/services/error.service";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ArtworkOptions } from "../../shared/enums/artwork-option.enum";
import { DataShareService } from "../../shared/services/data-share.service";
import { filter, Observable, of, Subscription, tap } from "rxjs";
import { VarDirective } from "../../common/directives/ng-var.directive";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { ControlCastPipe } from "../../common/pipes/control-cast.pipe";

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ControlCastPipe,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TextInputComponent,
        VarDirective
    ]
})
export class ContactComponent implements OnInit, OnDestroy {

    protected contactForm: FormGroup;
    protected hasSelectedParameters: boolean; 
    protected hasValidReferenceNr: boolean; // TODO(yqni13): add method to check input value length=6
    protected hasReferenceFromParams: boolean;
    protected readonly: boolean;
    protected selectedParams: string[];
    protected subjectOptions = Object.values(SubjectOptions);
    protected artworkOptions = Object.values(ArtworkOptions);
    protected artworkData$: Observable<string[]>;

    private subscription$ = new Subscription();

    constructor(
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
        this.readonly = false;
        this.selectedParams = [];
        this.artworkData$ = new Observable<string[]>();
    }
    
    ngOnInit() {
        this.subscription$ = this.dataShareService.sharedData$.pipe(
            filter((x) => !!x), // double exclamation mark (!!) => boolean check !!"" === false
            tap((data) => {
            this.artworkData$ = of(data);
            this.checkParameters(data);           
        })).subscribe();

        this.initEdit();
    }
    
    private initForm() {

        // TODO(yqni13): add validators

        this.contactForm = this.fb.group({
            subject: new FormControl('', Validators.required),
            referenceNr: new FormControl(''), // TODO(yqni13): custom validator to check for 6 char or valid referenceNr
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
            referenceNr: this.hasSelectedParameters ? this.selectedParams[0] : '',
            type: this.hasSelectedParameters ? this.selectedParams[1] : '',
            email: '',
            honorifics: '',
            title: '',
            firstName: '',
            lastName: '',
            message: ''
        })
    }

    private checkParameters(data: string[]) {
        if(data !== null || data !== undefined) {
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
            this.selectedParams = [];
        }
    }

    onSubmit() {
        this.contactForm.markAllAsTouched();
        
        if(this.contactForm.invalid) {
            console.log('form invalid', this.contactForm);
            return;
        }

        this.mailService.setMailData(this.contactForm.getRawValue());
        this.mailService.sendMail().subscribe();
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}