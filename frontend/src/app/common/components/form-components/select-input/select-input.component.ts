import { AfterViewInit, Component, ElementRef, forwardRef, input, output, viewChild } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../../abstracts/form-input.abstract.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'artdv-selectinput',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        ValidationMessageComponent
    ],
    templateUrl: './select-input.component.html',
    styleUrl: './select-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectInputComponent),
            multi: true,
        }
    ]
})
export class SelectInputComponent extends AbstractInputComponent implements AfterViewInit {

    private readonly isAutoFocus = viewChild<ElementRef>('isAutoFocus');

    readonly fieldName = input.required<string>();
    readonly formControl = input(new FormControl());
    readonly placeholder = input.required<string>();
    readonly ngClass = input<string>('');
    readonly className = input<string>('');
    readonly options = input<unknown>({});
    readonly optionsTranslateRoot = input.required<string>();
    readonly hasAutoFocus = input(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly byChange = output<any>();

    constructor() {
        super();
    }

    ngAfterViewInit() {
        if(this.hasAutoFocus()) {
            this.isAutoFocus()?.nativeElement.focus();
        }
    }

    selectOption(option: Event) {
        this.byChange.emit(option);
    }
}