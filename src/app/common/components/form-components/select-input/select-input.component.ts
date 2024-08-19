import { Component, forwardRef, Input } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { CastAbstractToFormControlPipe } from "../../../pipes/cast-abstracttoform-control.pipe";
import { AbstractInputComponent } from "../abstract-input.component";

@Component({
    selector: 'agal-selectinput',
    templateUrl: './select-input.component.html',
    styleUrl: './select-input.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        CastAbstractToFormControlPipe,
        ReactiveFormsModule,
        ValidationMessageComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectInputComponent),
            multi: true,
        }
    ]
})
export class SelectInputComponent extends AbstractInputComponent {

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() placeholder: string;
    @Input() ngClass: string;
    @Input() className: string;
    @Input() options: string[];

    constructor() {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.placeholder = '';
        this.ngClass = '';
        this.className = '';
        this.options = [];
    }
}