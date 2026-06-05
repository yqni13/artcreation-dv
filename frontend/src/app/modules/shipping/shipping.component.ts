import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ThemeObservationService } from "../../shared/services/theme-observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOption } from "../../shared/enums/theme-option.enum";

@Component({
    selector: 'app-shipping',
    imports: [
        TranslateModule
    ],
    templateUrl: './shipping.component.html',
    styleUrl: './shipping.component.scss'
})
export class ShippingComponent implements OnInit, OnDestroy {

    private readonly themeObserve = inject(ThemeObservationService);

    protected selectedBg = '';
    protected blockProcess: Record<string, string> = {
        img1: '',
        img2: '',
        img3: ''
    };
    protected blockShipment: {img: string} = {img: ''};
    protected blockDelay: {img: string} = {img: ''};
    protected blockRefund: Record<string, string> = {img1: '', img2: ''};
    protected blockLost: {img: string} = {img: ''};
    protected blockPackaging: Record<string, string> = {
        img1: '',
        img2: '',
        link1: 'https://www.gerstaecker.at/',
        link2: 'https://www.amazon.de/',
        link3: 'https://www.boesner.at/'
    };

    private subscriptionThemeObservation$ = new Subscription();

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
                        this.blockPackaging['img1'] = '/assets/shipping/block6_01_lightmode.svg';
                        this.blockPackaging['img2'] = '/assets/shipping/block6_02_lightmode.svg';
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
                        this.blockPackaging['img1'] = '/assets/shipping/block6_01_darkmode.svg';
                        this.blockPackaging['img2'] = '/assets/shipping/block6_02_darkmode.svg';
                    }
                }
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}