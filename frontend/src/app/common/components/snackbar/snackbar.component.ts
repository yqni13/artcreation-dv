import { Component, HostListener, Input, OnInit } from "@angular/core";
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

    @HostListener('window:keydown', ['$event'])
    closeOnEscape(event: KeyboardEvent) {        
        if(event.key === 'Escape' && this.isActive) {
            this.close();
        }
    }

    @Input() snackbarMsg: SnackbarMessage;
    protected snackbarOptions = SnackbarOption;
    protected snackbarClass: string;
    protected snackbarIcon: string;

    private isActive: boolean;

    constructor(private snackbarService: SnackbarMessageService) {
        this.snackbarMsg = {
            title: '',
            text: '',
            type: SnackbarOption.info,
        }
        this.snackbarClass = '';
        this.snackbarIcon = '';
        this.isActive = false;
    }

    setSnackbarIcon() {
        switch(this.snackbarMsg.type) {
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

    ngOnInit() {
        this.snackbarClass = this.snackbarMsg.type || SnackbarOption.info;
        this.setSnackbarIcon();
        this.isActive = true;
    }

    close() {
        this.snackbarService.close(this.snackbarMsg);
        this.isActive = false;
    }
}