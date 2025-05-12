import { CommonModule } from "@angular/common";
import { CastAbstractToFormControlPipe } from "../pipes/cast-abstracttoform-control.pipe";
import { ImgUploadComponent } from "../components/img-upload/img-upload.component";
import { LoadingAnimationComponent } from "../components/animation/loading/loading-animation.component";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

export const AdminDetailImportsModule = [
    CommonModule,
    CastAbstractToFormControlPipe,
    ImgUploadComponent,
    LoadingAnimationComponent,
    ReactiveFormsModule,
    TranslateModule
]