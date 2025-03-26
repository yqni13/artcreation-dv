import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AboutComponent } from './modules/about/about.component';
import { ContactComponent } from './modules/contact/contact.component';
import { FAQComponent } from './modules/faq/faq.component';
import { GalleryComponent } from './modules/gallery/gallery.component';
import { ImprintComponent } from './modules/imprint/imprint.component';
import { PrivacyComponent } from './modules/privacy/privacy.component';
import { ArchiveComponent } from './modules/archive/archive.component';
import { ShippingComponent } from './modules/shipping/shipping.component';
import { PrintsComponent } from './modules/prints/prints.component';
import { GalleryDetailsComponent } from './modules/gallery/gallery-details/gallery-details.component';
import { LoginComponent } from './modules/login/login.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'home', showInNavbar: true, icon:'icon-Home', showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'admin',
        data: { title: 'admin', onAuth: true, showInNavbar: true, icon: 'icon-Admin', showInFooterConnect: false, showInFooterInfo: false },
        loadChildren: () => import('./modules/admin/admin.routes').then(feature => feature.adminRoutes)
    },
    {
        path: 'about',
        component: AboutComponent,
        data: { title: 'about', showInNavbar: true, icon: 'icon-About', showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'gallery',
        component: GalleryComponent,
        data: { title: 'gallery', showInNavbar: true, icon: 'icon-Gallery', showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'gallery/detail/:refNr',
        component: GalleryDetailsComponent,
        data: { title: 'Details', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: false }
    },    
    {
        path: 'prints',
        component: PrintsComponent,
        data: { title: 'prints', showInNavbar: true, icon:'icon-Prints', showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'faq',
        component: FAQComponent,
        data: { title: 'faq', showInNavbar: true, icon: 'icon-FAQ', showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'contact', showInNavbar: false, showInFooterConnect: true, showInFooterInfo: false }
    },
    {
        path: 'archive',
        component: ArchiveComponent,
        data: { title: 'archive', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: true }
    },
    {
        path: 'imprint',
        component: ImprintComponent,
        data: { title: 'imprint', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: true }
    },
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'login', onAuth: false, showInNavbar: false, showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'privacy',
        component: PrivacyComponent,
        data: { title: 'privacy', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: true }
    },
    {
        path: 'shipping',
        component: ShippingComponent,
        data: { title: 'shipping', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: '**',
        redirectTo: '/home',
    }
];
