import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Route, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule
    ]
})
export class NavigationComponent implements OnInit {
    
    protected routes: Route[];

    constructor (private navigation: NavigationService) {
        this.routes = [];
    }

    ngOnInit() {
        this.routes = this.getRoutes();
    }

    private getRoutes(): Route[] {
        return this.navigation.getNavigationRoutes();
    }
}