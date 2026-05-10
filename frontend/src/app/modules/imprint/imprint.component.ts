import { Component, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { BaseRoute } from "../../api/routes/base.route.enum";

@Component({
    selector: 'app-imprint',
    imports: [
        TranslateModule
    ],
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss',
})
export class ImprintComponent implements OnInit {

    protected ownerData: Record<string, string> = {
        name: 'Daniela Varga',
        address: 'Anton-Bruckner-Gasse 11,\n2544 Leobersdorf, Österreich',
        email: 'artcreation-dv@gmx.at',
        phone: '+436643445935'
    };
    protected devData: Record<string, string | BaseRoute> = {
        project: 'artcreation-dv',
        version: 'v2.0.4',
        github: 'https://github.com/yqni13/artcreation-dv/tree/production',
        portfolio: 'https://yqni13.com',
        contact: BaseRoute.SUPPORT
    };

    private imgPreloadLogin = new Image();

    ngOnInit() {
        this.imgPreloadLogin.src = '/assets/admin/login_bg_smaller_01.jpg';
    }
}