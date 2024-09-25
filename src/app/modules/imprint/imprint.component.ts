import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-imprint',
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ImprintComponent {

    constructor(private translate: TranslateService) {
        //
    }

}