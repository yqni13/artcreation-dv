import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-imprint',
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ImprintComponent {

    protected ownerData: any;
    protected devData: any;

    constructor(private translate: TranslateService) {
        this. devData = {
            project: 'artcreation-dv',
            version: 'v1.0.0-beta.12',
            github: 'https://github.com/yqni13/artcreation-dv',
            portfolio: 'https://yqni13.com',
            email: 'lukas.varga@yqni13.com'
        };

        this. ownerData = {
            name: 'Daniela Varga',
            address: '2500 Baden-Umgebung'
        };
    }

}