import { AfterViewInit, Component, computed, ElementRef, forwardRef, input, signal, viewChild } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../../abstracts/form-input.abstract.component";
import { TextCaseOption } from "../../../../shared/enums/text-case.enum";

@Component({
    selector: 'artdv-textinput',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidationMessageComponent
    ],
    templateUrl: './text-input.component.html',
    styleUrl: './text-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextInputComponent),
            multi: true,
        }
    ]
})
export class TextInputComponent extends AbstractInputComponent implements AfterViewInit {

    private readonly isAutoFocus = viewChild<ElementRef>('isAutoFocus');

    readonly readonly = input(false);
    readonly hasAutoFocus = input(false);
    readonly forceTextCase = input<TextCaseOption>(TextCaseOption.NEUTRAL);
    readonly inputType = input('');
    readonly inputTypeComputed = computed(() => this.showPassword() ? 'text' : 'password');

    protected textCaseOption = TextCaseOption;
    protected readonly showPassword = signal(false);

    constructor() {
        super();
    }

    ngAfterViewInit() {
        if(this.hasAutoFocus()) {
            this.isAutoFocus()?.nativeElement.focus();
        }
    }

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input) return;
    
        switch (this.forceTextCase()) {
            case this.textCaseOption.FORCEUP:
                input.value = input.value.toUpperCase();
                break;
            case this.textCaseOption.FORCELOW:
                input.value = input.value.toLowerCase();
                break;
            case this.textCaseOption.NEUTRAL:
            default:
                // no change
                break;
        }
    }

    setPasswordVisibility(visible: boolean) {
        this.showPassword.set(visible);
    }
}