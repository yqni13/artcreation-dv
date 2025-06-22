import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AdminGalleryListComponent } from "./admin-gallery/list/admin-gallery-list.component";
import { AdminGalleryDetailComponent } from "./admin-gallery/detail/admin-gallery-detail.component";
import { AuthGuardARTDV } from "../../shared/services/auth-guard.service";
import { AdminNewsListComponent } from "./admin-news/list/admin-news-list.component";
import { AdminNewsDetailComponent } from "./admin-news/detail/admin-news-detail.component";
import { ImgPreloadGuard } from "../../shared/services/img-preload-guard.service";
import { AdminAssetsListComponent } from "./admin-assets/list/admin-assets-list.component";
import { AdminAssetsDetailComponent } from "./admin-assets/detail/admin-assets-detail.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuardARTDV, ImgPreloadGuard],
        data: {
            preloadImages: [
                '/assets/admin/admin-gallery.jpg',
                '/assets/admin/admin-news.jpg',
                '/assets/admin/admin-assets.jpg',
                '/assets/admin/logout_bg_darkMode.svg',
                '/assets/admin/logout_bg_lightMode.svg'
            ]
        }
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
    {
        path: 'news/create',
        component: AdminNewsDetailComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'news/:id',
        component: AdminNewsDetailComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'assets',
        component: AdminAssetsListComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'assets/create',
        component: AdminAssetsDetailComponent,
        canActivate: [AuthGuardARTDV]
    },
    {
        path: 'assets/:id',
        component: AdminAssetsDetailComponent,
        canActivate: [AuthGuardARTDV]
    }
]