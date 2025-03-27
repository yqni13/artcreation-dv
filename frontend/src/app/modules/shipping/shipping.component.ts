import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ThemeObservationService } from "../../shared/services/theme-observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOption } from "../../shared/enums/theme-option.enum";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrl: './shipping.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ShippingComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected theme = ThemeOption;
    protected blockProcess: any;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly themeObserve: ThemeObservationService
    ) {
        this.selectedBg = '';
        this.blockProcess = {
            img1: '',
            img2: '',
            img3: ''
        }

        this.subscriptionThemeObservation$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionThemeObservation$ = this.themeObserve.themeOption$.pipe(
            tap((theme: ThemeOption) => {
                switch(theme) {
                    case(ThemeOption.lightMode): {
                        this.selectedBg = ThemeOption.lightMode;
                        this.blockProcess = {
                            img1: '/assets/shipping/block1_01_lightmode.svg',
                            img2: '/assets/shipping/block1_02_lightmode.svg',
                            img3: '/assets/shipping/block1_03_lightmode.svg'
                        }
                        break;
                    }
                    case(ThemeOption.darkMode):
                    default: {
                        this.selectedBg = ThemeOption.darkMode;
                        this.blockProcess = {
                            img1: '/assets/shipping/block1_01_darkmode.svg',
                            img2: '/assets/shipping/block1_02_darkmode.svg',
                            img3: '/assets/shipping/block1_03_darkmode.svg'
                        }
                    }
                }
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}