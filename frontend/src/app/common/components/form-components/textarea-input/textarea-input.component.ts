import { Component, forwardRef, Input } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../../abstracts/form-input.abstract.component";

@Component({
    selector: 'artdv-textareainput',
    templateUrl: './textarea-input.component.html',
    styleUrl: './textarea-input.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidationMessageComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaInputComponent),
            multi: true,
        }
    ]
})
export class TextareaInputComponent extends AbstractInputComponent {

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() placeholder: string;
    @Input() ngClass: string;
    @Input() className: string;
    @Input() rows: number;

    constructor() {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.placeholder = '';
        this.ngClass = '';
        this.className = '';
        this.rows = 0;
    }
}