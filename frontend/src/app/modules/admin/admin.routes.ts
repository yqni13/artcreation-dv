import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AdminGalleryComponent } from "./admin-gallery/admin-gallery.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent
    },
    {
        path: 'gallery',
        component: AdminGalleryComponent
    }
]