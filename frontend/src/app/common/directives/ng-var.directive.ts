/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[artdvVar]'
})
export class VarDirective {
    @Input()
    set artdvVar(context: unknown) {
        this.context.$implicit = this.context.artdvVar = context;

        if (!this.hasView) {
            this.vcRef.createEmbeddedView(this.templateRef, this.context);
            this.hasView = true;
        }
    }

    private context: {
        $implicit: unknown;
        artdvVar: unknown;
    } = {
        $implicit: null,
        artdvVar: null,
    };

    private hasView = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private vcRef: ViewContainerRef
    ) {}
}