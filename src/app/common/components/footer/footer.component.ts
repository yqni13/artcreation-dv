import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Route, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { SnackbarOption } from "../../../shared/enums/snackbar-option.enum";

@Component({
    selector: 'agal-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class FooterComponent implements OnInit {

    protected infoRoutes: Route[];
    protected connectRoutes: Route[];
    protected socialmediaURL: string;
    protected creatorURL: string;

    constructor(
        private snackbarService: SnackbarMessageService,
        private navigation: NavigationService,
    ) {

        this.infoRoutes = [];
        this.connectRoutes = [];
        this.socialmediaURL = 'https://instagram.com/vargarella_';
        this.creatorURL = 'https://yqni13.github.io/portfolio';
    }

    ngOnInit() {
        this.connectRoutes = this.getConnectRoutes();
        this.infoRoutes = this.getInfoRoutes();
    }

    private getInfoRoutes(): Route[] {
        return this.navigation.getFooterInfoRoutes();
    }

    private getConnectRoutes(): Route[] {
        return this.navigation.getFooterConnectRoutes();
    }

    alertAvailability() {
        this.snackbarService.notify({
            title: 'Shipping not available.',
            autoClose: true,
            type: SnackbarOption.error
        })
    }
}