import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AdminGalleryListComponent } from "./admin-gallery/list/admin-gallery-list.component";
import { AdminGalleryDetailComponent } from "./admin-gallery/detail/admin-gallery-detail.component";
import { AuthGuardARTDV } from "../../shared/services/auth-guard.service";
import { AdminNewsListComponent } from "./admin-news/list/admin-news-list.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'gallery',
        component: AdminGalleryListComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'gallery/create',
        component: AdminGalleryDetailComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'gallery/:id',
        component: AdminGalleryDetailComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'news',
        component: AdminNewsListComponent,
        canActivate: [AuthGuardARTDV]
    },
]