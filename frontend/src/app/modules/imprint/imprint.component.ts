import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-imprint',
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ImprintComponent implements OnInit {

    protected ownerData: any;
    protected devData: any;

    private imgPreloadLogin: any;

    constructor() {
        this. devData = {
            project: 'artcreation-dv',
            version: 'v1.2.1',
            github: 'https://github.com/yqni13/artcreation-dv/tree/production',
            portfolio: 'https://yqni13.com',
            email: 'lukas.varga@yqni13.com'
        };

        this. ownerData = {
            name: 'Daniela Varga',
            address: 'Anton Bruckner-Gasse 11\n2544 Leobersdorf, Österreich',
            email: 'artcreation-dv@gmx.at',
            phone: '+436643445935'
        };

        this.imgPreloadLogin = new Image();
    }

    ngOnInit() {
        this.imgPreloadLogin.src = '/assets/admin/login_bg_smaller_01.jpg';
    }
}