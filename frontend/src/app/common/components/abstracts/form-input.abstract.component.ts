/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, input, OnDestroy, OnInit, output } from "@angular/core";
import { ControlValueAccessor, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
    template: ''
})
export class AbstractInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

    private onChange!: (value: unknown) => void;
    private onTouch!: (value: unknown) => void;

    readonly fieldName = input.required<string>();
    readonly formControl = input.required<FormControl>();
    readonly placeholder = input.required<string>();
    readonly ngClass = input('');
    readonly className = input('');

    readonly byChange = output<unknown>();

    input!: unknown;
    private subscription$ = new Subscription();

    ngOnInit() {
        this.subscription$ = this.formControl().valueChanges.subscribe(change => {
            this.byChange.emit(change);
        })
    }

    writeValue(input: unknown) {
        this.input = input;
    }
    registerOnChange(fn: any) {
        this.onChange = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouch = fn;
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}