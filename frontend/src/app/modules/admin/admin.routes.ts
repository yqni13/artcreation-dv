import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AdminGalleryListComponent } from "./admin-gallery/list/admin-gallery-list.component";
import { AdminGalleryDetailComponent } from "./admin-gallery/detail/admin-gallery-detail.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent
    },
    {
        path: 'gallery',
        component: AdminGalleryListComponent
    },
    {
        path: 'gallery/create',
        component: AdminGalleryDetailComponent
    },
    {
        path: 'gallery/:id',
        component: AdminGalleryDetailComponent
    },
]