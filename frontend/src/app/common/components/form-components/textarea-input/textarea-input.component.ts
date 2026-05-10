import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../../abstracts/form-input.abstract.component";

@Component({
    selector: 'artdv-textareainput',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidationMessageComponent
    ],
    templateUrl: './textarea-input.component.html',
    styleUrl: './textarea-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaInputComponent),
            multi: true,
        }
    ]
})
export class TextareaInputComponent extends AbstractInputComponent {

    readonly rows = input.required<number>();
    readonly maxLength = input(0);

    constructor() {
        super();
    }
}