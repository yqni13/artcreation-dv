import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { NavigationStart, Route, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-footer',
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

    constructor(
        private navigation: NavigationService,
        private router: Router
    ) {
        router.events.subscribe(e => {
            if(e instanceof NavigationStart && typeof window !== 'undefined') {
                window.scrollTo(0,0);
            }
        })

        this.infoRoutes = [];
        this.connectRoutes = [];
        this.socialmediaURL = 'https://instagram.com/vargarella_'
    }

    ngOnInit() {
        this.infoRoutes = this.getInfoRoutes();
        this.connectRoutes = this.getConnectRoutes();
    }

    private getInfoRoutes(): Route[] {
        return this.navigation.getFooterInfoRoutes();
    }

    private getConnectRoutes(): Route[] {
        return this.navigation.getFooterConnectRoutes();
    }

}