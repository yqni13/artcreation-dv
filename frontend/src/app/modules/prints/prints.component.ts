import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-prints',
    templateUrl: './prints.component.html',
    styleUrl: './prints.component.scss',
    imports: [
        RouterModule,
        TranslateModule
    ]
})
export class PrintsComponent {

    constructor(private translate: TranslateService) {
        //
    }
}