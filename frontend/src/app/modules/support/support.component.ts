import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SupportAPIService } from "../../api/services/support.api.service";
import { SupportXYZRequest } from "../../api/interfaces/support.interface";

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrl: './support.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
    ]
})
export class SupportComponent implements OnInit{

    protected supportForm: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly supportApi: SupportAPIService,
    ) {
        this.supportForm = new FormGroup({});
    }

    ngOnInit() {
        this.initEdit();
    }

    private initForm() {
        this.supportForm = this.fb.group({
            test: new FormControl(''),
        });
    }

    private initEdit() {
        this.initForm();
        this.supportForm.patchValue({
            test: ''
        });
    }

    onSubmit() {
        this.supportForm.markAllAsTouched();
        if(this.supportForm.invalid) {
            return;
        }

        const data: SupportXYZRequest = {
            test: this.supportForm.get('test')?.value,
        };
        this.supportApi.setXYZData(data);
        this.supportApi.sendXYZRequest().subscribe();
    }
}