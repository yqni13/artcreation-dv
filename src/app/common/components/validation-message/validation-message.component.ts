import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { VarDirective } from "../../directives/ng-var.directive";

@Component({
    selector: 'agal-validation',
    templateUrl: './validation-message.component.html',
    styleUrl: './validation-message.component.scss',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ValidationMessageComponent),
            multi: true,
        }
    ],
    imports: [
        CommonModule,
        VarDirective
    ]
})
export class ValidationMessageComponent {

    @Input() agalControl: FormControl;
    @Input() fieldName: string;

    constructor() { 
        this.agalControl = new FormControl();
        this.fieldName = '';
    }
}