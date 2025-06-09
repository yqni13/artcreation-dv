import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import * as content from "../../../../public/assets/i18n/en.json";
import { CommonModule } from "@angular/common";
import { Subscription, tap } from "rxjs";
import { ThemeObservationService } from "../../shared/services/theme-observation.service";
import { ThemeOption } from "../../shared/enums/theme-option.enum";
import { BaseRoute } from "../../api/routes/base.route.enum";
import { ImgFullscaleComponent } from "../../common/components/img-fullscale/img-fullscale.component";

@Component({
    selector: 'app-prints',
    templateUrl: './prints.component.html',
    styleUrl: './prints.component.scss',
    imports: [
        CommonModule,
        ImgFullscaleComponent,
        RouterModule,
        TranslateModule
    ]
})
export class PrintsComponent implements OnInit, OnDestroy {

    protected paperPrintsListLength: number;
    protected baseRoute = BaseRoute;
    protected isFullscale: boolean;
    protected blockPriceInfo: any;
    protected activeFullscaleImg: string;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly themeObserve: ThemeObservationService
    ) {
        this.paperPrintsListLength = Object.keys(content['modules']['prints']['paper']['list']).length;
        this.isFullscale = false;
        this.activeFullscaleImg = '';

        this.subscriptionThemeObservation$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionThemeObservation$ = this.themeObserve.themeOption$.pipe(
            tap((theme: ThemeOption) => {
                switch(theme) {
                    case(ThemeOption.lightMode): {
                        this.blockPriceInfo = {
                            img: '/assets/prints/block3_lightmode.svg'
                        }
                        break;
                    }
                    case(ThemeOption.darkMode):
                    default: {
                        this.blockPriceInfo = {
                            img: '/assets/prints/block3_darkmode.svg'
                        }
                    }
                }
            })
        ).subscribe();
    }

    setActiveFullscaleImg(path: string) {
        this.activeFullscaleImg = path;
    }

    navigateFullscale(flag: boolean) {
        this.isFullscale = flag;
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}