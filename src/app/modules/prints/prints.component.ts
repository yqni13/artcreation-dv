import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-prints',
    templateUrl: './prints.component.html',
    styleUrl: './prints.component.scss',
    standalone: true,
    imports: [
        RouterModule
    ]
})
export class PrintsComponent {

    constructor() {
        //
    }
}