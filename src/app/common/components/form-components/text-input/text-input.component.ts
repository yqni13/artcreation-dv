/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessageComponent } from "../../validation-message/validation-message.component";
import { CommonModule } from "@angular/common";
import { CastAbstractToFormControlPipe } from "../../../pipes/cast-abstracttoform-control.pipe";
import { AbstractInputComponent } from "../abstract-input.component";
import { Subscription } from "rxjs";

@Component({
    selector: 'artdv-textinput',
    templateUrl: './text-input.component.html',
    styleUrl: './text-input.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        CastAbstractToFormControlPipe,
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
export class TextInputComponent extends AbstractInputComponent implements OnInit, OnDestroy {

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() inputType: string;
    @Input() className: string;
    @Input() ngClass: string;

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
        this.byChange = new EventEmitter<any>();
        this.subscription$ = new Subscription();
    }
    
    ngOnInit() {
        this.subscription$ = this.formControl.valueChanges.subscribe(change => {
            this.byChange.emit(change);
        })
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}