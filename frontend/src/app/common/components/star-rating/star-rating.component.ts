/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, effect, ElementRef, input,OnChanges, output, signal, SimpleChanges, viewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'artdv-starrating',
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './star-rating.component.html',
    styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent implements OnChanges {

    private readonly star1Ref = viewChild.required<ElementRef>('star1Ref');
    private readonly star2Ref = viewChild.required<ElementRef>('star2Ref');
    private readonly star3Ref = viewChild.required<ElementRef>('star3Ref');
    private readonly star4Ref = viewChild.required<ElementRef>('star4Ref');
    private readonly star5Ref = viewChild.required<ElementRef>('star5Ref');

    readonly startValue = input(0);
    readonly resetValue = input<{value: number}>({value: 5});
    readonly byChange = output<any>();

    protected hasNewRating = false;
    protected rawRating = Number(this.startValue);
    protected readonly startValueSignal = signal(Number(this.startValue()))

    constructor() {
        effect(() => { this.handleValueReset(); });
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes['startValue']) {
            this.startValueSignal.set(this.convertFloat2Int(changes['startValue']['currentValue']));
            this.rawRating = changes['startValue']['currentValue'];
        }
    }

    private handleValueReset() {
        const value = this.resetValue();
        this.rawRating = value['value'];
        switch(this.convertFloat2Int(value['value'])) {
            case(1): {
                this.star1Ref().nativeElement.checked = true;
                break;
            }
            case(2): {
                this.star2Ref().nativeElement.checked = true;
                break;
            }
            case(3): {
                this.star3Ref().nativeElement.checked = true;
                break;
            }
            case(4): {
                this.star4Ref().nativeElement.checked = true;
                break;
            }
            case(5):
            default:
                this.star5Ref().nativeElement.checked = true;
        }
    }

    private convertFloat2Int(raw: number) {
        return (raw - Math.floor(raw)) >= 0.5 ? Math.ceil(raw) : Math.floor(raw);
    }

    onChange(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        this.byChange.emit(input.value);
        this.rawRating = Number(input.value);
        this.hasNewRating = true;
    }
}