import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { VarDirective } from "../../directives/ng-var.directive";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'artdv-validation',
    imports: [
        TranslateModule,
        VarDirective
    ],
    templateUrl: './validation-message.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './validation-message.component.scss'
})
export class ValidationMessageComponent {

    readonly ngControl = input(new FormControl());
    readonly fieldName = input('');
}