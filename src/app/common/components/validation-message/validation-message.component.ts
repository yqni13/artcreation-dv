import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { VarDirective } from "../../directives/ng-var.directive";

@Component({
    selector: 'agal-validation',
    templateUrl: './validation-message.component.html',
    styleUrl: './validation-message.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        VarDirective
    ]
})
export class ValidationMessageComponent {

    @Input() ngControl: FormControl;
    @Input() fieldName: string;

    constructor() { 
        this.ngControl = new FormControl();
        this.fieldName = '';
    }
}