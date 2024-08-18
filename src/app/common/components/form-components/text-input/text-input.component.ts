import { Component, forwardRef, Input } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { ControlCastPipe } from "../../../pipes/control-cast.pipe";
import { AbstractInputComponent } from "../abstract-input.component";

@Component({
    selector: 'agal-textinput',
    templateUrl: './text-input.component.html',
    styleUrl: './text-input.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ControlCastPipe,
        ReactiveFormsModule,
        ValidationMessageComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextInputComponent),
            multi: true,
        }
    ]
})
export class TextInputComponent extends AbstractInputComponent {

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() inputType: string;  
    @Input() ngClass: string;
    @Input() className: string;

    constructor() {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.readonly = false;
        this.placeholder = '';
        this.inputType = '';
        this.ngClass = '';
        this.className = '';
    }
}