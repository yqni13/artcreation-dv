import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: 'artdv-starrating',
    templateUrl: './star-rating.component.html',
    styleUrl: './star-rating.component.scss',
    imports: [
        CommonModule
    ],
})
export class StarRatingComponent {

    @ViewChild('star1Ref') star1Ref!: ElementRef;
    @ViewChild('star2Ref') star2Ref!: ElementRef;
    @ViewChild('star3Ref') star3Ref!: ElementRef;
    @ViewChild('star4Ref') star4Ref!: ElementRef;
    @ViewChild('star5Ref') star5Ref!: ElementRef;

    @Input() startValue: number;
    @Input() resetValue: Observable<number>;
    @Output() byChange: EventEmitter<any>;

    protected hasNewRating: boolean;

    constructor() {
        this.startValue = 0;
        this.resetValue = new Observable();
        this.byChange = new EventEmitter<any>();

        this.hasNewRating = false;
    }

    ngOnInit() {
        this.resetValue.subscribe(change => {
            switch(change) {
                case(1): {
                    this.star1Ref.nativeElement.checked = true;
                    break;
                }
                case(2): {
                    this.star2Ref.nativeElement.checked = true;
                    break;
                }
                case(3): {
                    this.star3Ref.nativeElement.checked = true;
                    break;
                }
                case(4): {
                    this.star4Ref.nativeElement.checked = true;
                    break;
                }
                case(5):
                default:
                    this.star5Ref.nativeElement.checked = true;
            }
        })
    }

    onChange(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        this.byChange.emit(input.value);
        this.hasNewRating = true;
    }
}