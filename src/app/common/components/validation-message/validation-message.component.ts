import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { VarDirective } from "../../directives/ng-var.directive";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'artdv-validation',
    templateUrl: './validation-message.component.html',
    styleUrl: './validation-message.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        VarDirective
    ]
})
export class ValidationMessageComponent {

    @Input() ngControl: FormControl;
    @Input() fieldName: string;

    constructor(private translate: TranslateService) { 
        this.ngControl = new FormControl();
        this.fieldName = '';
    }
}