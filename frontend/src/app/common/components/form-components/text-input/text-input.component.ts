/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../abstract-input.component";
import { Subscription } from "rxjs";

@Component({
    selector: 'artdv-textinput',
    templateUrl: './text-input.component.html',
    styleUrl: './text-input.component.scss',
    imports: [
        CommonModule,
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
export class TextInputComponent extends AbstractInputComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('isAutoFocus') isAutoFocus!: ElementRef;

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() inputType: string;
    @Input() className: string;
    @Input() ngClass: string;
    @Input() showPassword: boolean;
    @Input() hasAutoFocus: boolean;

    @Output() byChange: EventEmitter<any>;

    private subscription$: Subscription;

    constructor() {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.readonly = false;
        this.placeholder = '';
        this.inputType = '';
        this.className = '';
        this.ngClass = '';
        this.showPassword = false;
        this.hasAutoFocus = false;
        this.byChange = new EventEmitter<any>();
        this.subscription$ = new Subscription();
    }
    
    ngOnInit() {
        this.subscription$ = this.formControl.valueChanges.subscribe(change => {
            this.byChange.emit(change);
        })
    }

    ngAfterViewInit() {
        if(this.hasAutoFocus) {
            this.isAutoFocus.nativeElement.focus();
        }
    }

    setPasswordVisibility(visible: boolean) {
        this.showPassword = visible
        if(visible) {
            this.inputType = 'text';
        } else {
            this.inputType = 'password';
        }
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}