import { Component, Input, OnInit } from "@angular/core";
import { SnackbarMessage } from "../../../shared/interfaces/SnackbarMessage";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { CommonModule } from "@angular/common";
import { SnackbarOption } from "../../../shared/enums/snackbar-option.enum";

@Component({
    selector: 'artdv-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    imports: [
        CommonModule
    ]
})
export class SnackbarComponent implements OnInit {

    @Input() snackbarMsg: SnackbarMessage;
    protected snackbarOptions = SnackbarOption;
    protected snackbarClass: string;

    constructor(private snackbarService: SnackbarMessageService) {
        this.snackbarMsg = {
            title: '',
            text: '',
            type: '',
        }
        this.snackbarClass = '';
    }

    ngOnInit() {
        this.snackbarClass = this.snackbarMsg.type || SnackbarOption.info;
    }

    close() {
        this.snackbarService.close(this.snackbarMsg);
    }
}