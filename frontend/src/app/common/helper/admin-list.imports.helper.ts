import { TranslateModule } from '@ngx-translate/core';
import { SelectInputComponent } from './../components/form-components/select-input/select-input.component';
import { LoadingAnimationComponent } from './../components/animation/loading/loading-animation.component';
import { CommonModule } from '@angular/common';
import { CastAbstractToFormControlPipe } from './../pipes/cast-abstracttoform-control.pipe';
import { TextInputComponent } from '../components/form-components/text-input/text-input.component';
import { CacheCheckPipe } from '../pipes/cache-check.pipe';

export const AdminListImportsModule = [
    CacheCheckPipe,
    CastAbstractToFormControlPipe,
    CommonModule,
    LoadingAnimationComponent,
    SelectInputComponent,
    TextInputComponent,
    TranslateModule
]