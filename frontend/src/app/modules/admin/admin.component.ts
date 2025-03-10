import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../../shared/services/auth.service";
import { Router, RouterModule } from "@angular/router";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class AdminComponent {

    protected authorGalleryImg: string;
    protected authorNewsImg: string;
    protected authorLogoutImg: string;
    protected editLabel: string;

    constructor(
        private readonly router: Router,
        private readonly auth: AuthService,
    ) {
        this.authorGalleryImg = 'https://pixabay.com/de/users/stocksnap-894430/';
        this.authorNewsImg = 'https://pixabay.com/de/photos/news-tageszeitung-presse-1172463/';
        this.authorLogoutImg = 'https://pixabay.com/de/users/tama66-1032521/';
        this.editLabel = 'edit: ';
    }

    logout() {
        this.auth.logout();
        if(!this.auth.isLoggedIn()) {
            this.router.navigate(['login']);
        }
    }
}