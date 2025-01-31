import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class AdminComponent {

    constructor(
        private readonly router: Router,
        private readonly auth: AuthService,
        private readonly translate: TranslateService
    ) {
        //
    }

    logout() {
        this.auth.logout();
        if(!this.auth.isLoggedIn()) {
            this.router.navigate(['login']);
        }
    }
}