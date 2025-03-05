import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { TextInputComponent } from "../../../common/components/form-components/text-input/text-input.component";
import { GalleryAPIService } from "../../../api/services/gallery.api.service";
import { GalleryItem } from "../../../api/models/gallery-response.interface";

@Component({
    selector: 'app-admin-gallery',
    templateUrl: './admin-gallery.component.html',
    styleUrl: './admin-gallery.component.scss',
    imports: [
        CommonModule,
        TextInputComponent,
        TranslateModule
    ]
})
export class AdminGalleryComponent implements OnInit {

    protected hasKeyword: boolean;
    protected galleryList: GalleryItem[];
    
    constructor(
        private readonly galleryApi: GalleryAPIService
    ) {
        this.hasKeyword = false;
        this.galleryList = [];
    }

    ngOnInit() {
        this.galleryApi.sendGetAllRequest().subscribe(data => {
            this.galleryList = data.body?.body.data ?? [];
            console.log("data: ", data);
        })
    }

    filterForKeyword() {
        console.log("click filterForKeyword")
    }

    removeKeyword() {

    }
}