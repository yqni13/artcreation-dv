import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";
import { MailService } from "../../shared/services/mail.service";
import { ErrorService } from "../../shared/services/error.service";
import { ValidationMessageComponent } from "../../common/components/validation-message/validation-message.component";

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidationMessageComponent
    ]
})
export class ContactComponent implements OnInit {

    @Input() selectedReference!: string;

    protected contactForm: FormGroup;
    protected hasReferenceNr: boolean;
    protected subjectOptions = Object.values(SubjectOptions);

    constructor(
        private mailService: MailService,
        private errorService: ErrorService,
        private fb: FormBuilder
    ) {
        this.contactForm = new FormGroup({});
        this.hasReferenceNr = false;
    }

    ngOnInit() {
        this.checkForReferenceNr();
        this.initEdit();
    }
    
    private initForm() {

        // TODO(yqni13): add validators + custom text/textarea/selector components

        this.contactForm = this.fb.group({
            subject: new FormControl('', Validators.required),
            referenceNr: new FormControl(''),
            email: new FormControl('', [Validators.required, Validators.email]),
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required)
        })
    }

    private initEdit() {
        this.initForm();
        this.contactForm.patchValue({
            subject: '',
            referenceNr: this.hasReferenceNr ? this.selectedReference : '', 
            email: '',
            firstName: '',
            lastName: '',
            message: ''
        })
    }

    private checkForReferenceNr() {
        if(this.selectedReference && this.selectedReference.length > 0) {
            this.hasReferenceNr = true;
        } else {
            this.hasReferenceNr = false;
        }
    }    

    onSubmit() {
        this.contactForm.markAllAsTouched();
        
        if(this.contactForm.invalid) {
            console.log('form invalid');
            return;
        }

        this.mailService.setMailData(this.contactForm.getRawValue());
        this.mailService.sendMail().subscribe();
    }

}