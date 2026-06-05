import { Directive, inject, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[artdvVar]'
})
export class VarDirective {

    private readonly templateRef = inject(TemplateRef<unknown>);
    private readonly vcRef = inject(ViewContainerRef);

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
}