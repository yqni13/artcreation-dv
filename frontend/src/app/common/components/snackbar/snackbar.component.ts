import { Component, inject, input, OnInit } from "@angular/core";
import { SnackbarMessage } from "../../../shared/interfaces/snackbar.interface";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { CommonModule } from "@angular/common";
import { SnackbarOption } from "../../../shared/enums/snackbar-option.enum";

@Component({
    selector: 'artdv-snackbar',
    imports: [
        CommonModule
    ],
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    host: {
        '(document:keydown)': 'closeOnEscape($event)'
    }
})
export class SnackbarComponent implements OnInit {

    private snackbarService = inject(SnackbarMessageService);

    readonly snackbarMsg = input.required<SnackbarMessage>();
    protected snackbarOptions = SnackbarOption;
    protected snackbarClass = '';
    protected snackbarIcon = '';

    private isActive = false;

    ngOnInit() {
        this.snackbarClass = this.snackbarMsg().type || SnackbarOption.info;
        this.setSnackbarIcon();
        this.isActive = true;
    }

    setSnackbarIcon() {
        switch(this.snackbarMsg().type) {
            case(SnackbarOption.error): {
                this.snackbarIcon = 'icon-SnackbarError';
                break;
            }
            case(SnackbarOption.info): {
                this.snackbarIcon = 'icon-SnackbarInfo';
                break;
            }
            case(SnackbarOption.success): {
                this.snackbarIcon = 'icon-SnackbarSuccess';
                break;
            }
            default: {
                this.snackbarIcon = 'icon-SnackbarWarning'
            }
        }
    }

    closeOnEscape(event: KeyboardEvent) {        
        if(event.key === 'Escape' && this.isActive) {
            this.close();
        }
    }

    close() {
        this.snackbarService.close(this.snackbarMsg());
        this.isActive = false;
    }
}