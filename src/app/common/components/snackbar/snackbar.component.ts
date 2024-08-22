import { Component, Input } from "@angular/core";
import { SnackbarMessage } from "../../../shared/interfaces/SnackbarMessage";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { CommonModule } from "@angular/common";
import { SnackbarOption } from "../../../shared/enums/snackbar-option.enum";

@Component({
    selector: 'agal-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class SnackbarComponent {

    @Input() snackbarMsg: SnackbarMessage;
    protected snackbarOptions = SnackbarOption;

    constructor(private snackbarService: SnackbarMessageService) {
        this.snackbarMsg = {
            title: '',
            text: '',
            type: '',
        }
    }

    close() {
        this.snackbarService.close(this.snackbarMsg);
    }
}