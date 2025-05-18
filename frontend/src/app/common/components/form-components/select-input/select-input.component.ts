/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../../abstracts/form-input.abstract.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'artdv-selectinput',
    templateUrl: './select-input.component.html',
    styleUrl: './select-input.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
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
export class SelectInputComponent extends AbstractInputComponent implements AfterViewInit {

    @ViewChild('isAutoFocus') isAutoFocus!: ElementRef;

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() placeholder: string;
    @Input() ngClass: string;
    @Input() className: string;
    @Input() options: any;
    @Input() optionsTranslateRoot: string;
    @Input() hasAutoFocus: boolean;

    @Output() byChange: EventEmitter<any>;

    constructor(private translate: TranslateService) {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.placeholder = '';
        this.ngClass = '';
        this.className = '';
        this.options = [];
        this.optionsTranslateRoot = '';
        this.hasAutoFocus = false;
        this.byChange = new EventEmitter<any>();
    }

    ngAfterViewInit() {
        if(this.hasAutoFocus) {
            this.isAutoFocus.nativeElement.focus();
        }
    }

    selectOption(option: Event) {
        this.byChange.emit(option);
    }
}