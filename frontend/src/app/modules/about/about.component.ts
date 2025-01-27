import { Component } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    imports: [
        TranslateModule
    ]
})
export class AboutComponent {

    constructor(private translate: TranslateService) {
        //
    }
    
}