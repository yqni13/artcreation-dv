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
    protected blockShipment: any;
    protected blockDelay: any;
    protected blockRefund: any;
    protected blockLost: any;
    protected blockPackaging: any;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly themeObserve: ThemeObservationService
    ) {
        this.selectedBg = '';
        this.blockProcess = {
            img1: '',
            img2: '',
            img3: ''
        };
        this.blockShipment = {
            img: ''
        }
        this.blockDelay = {
            img: ''
        }
        this.blockRefund = {
            img1: '',
            img2: ''
        }
        this.blockLost = {
            img: ''
        }
        this.blockPackaging = {
            img1: '',
            img2: '',
            link1: 'https://www.gerstaecker.at/',
            link2: 'https://www.amazon.de/',
            link3: 'https://www.boesner.at/'
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
                        };
                        this.blockShipment = {
                            img: '/assets/shipping/block2_01_lightmode.svg'
                        }
                        this.blockDelay = {
                            img: '/assets/shipping/block3_lightmode.svg'
                        }
                        this.blockRefund = {
                            img1: '/assets/shipping/block4_01_lightmode.webp',
                            img2: '/assets/shipping/block4_02_lightmode.svg'
                        }
                        this.blockLost = {
                            img: '/assets/shipping/block5_lightmode.svg'
                        }
                        this.blockPackaging.img1 = '/assets/shipping/block6_01_lightmode.svg';
                        this.blockPackaging.img2 = '/assets/shipping/block6_02_lightmode.svg';
                        break;
                    }
                    case(ThemeOption.darkMode):
                    default: {
                        this.selectedBg = ThemeOption.darkMode;
                        this.blockProcess = {
                            img1: '/assets/shipping/block1_01_darkmode.svg',
                            img2: '/assets/shipping/block1_02_darkmode.svg',
                            img3: '/assets/shipping/block1_03_darkmode.svg'
                        };
                        this.blockShipment = {
                            img: '/assets/shipping/block2_01_darkmode.svg'
                        }
                        this.blockDelay = {
                            img: '/assets/shipping/block3_darkmode.svg'
                        }
                        this.blockRefund = {
                            img1: '/assets/shipping/block4_01_darkmode.webp',
                            img2: '/assets/shipping/block4_02_darkmode.svg'
                        }
                        this.blockLost = {
                            img: '/assets/shipping/block5_darkmode.svg'
                        }
                        this.blockPackaging.img1 = '/assets/shipping/block6_01_darkmode.svg';
                        this.blockPackaging.img2 = '/assets/shipping/block6_02_darkmode.svg';
                    }
                }
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}