/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[agalVar]',
    standalone: true
})
export class VarDirective {
    @Input()
    set agalVar(context: unknown) {
        this.context.$implicit = this.context.agalVar = context;

        if (!this.hasView) {
            this.vcRef.createEmbeddedView(this.templateRef, this.context);
            this.hasView = true;
        }
    }

    private context: {
        $implicit: unknown;
        agalVar: unknown;
    } = {
        $implicit: null,
        agalVar: null,
    };

    private hasView = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private vcRef: ViewContainerRef
    ) {}
}