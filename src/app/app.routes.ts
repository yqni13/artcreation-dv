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

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home', showInNavbar: true, showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'about',
        component: AboutComponent,
        data: { title: 'About', showInNavbar: true, showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'gallery',
        component: GalleryComponent,
        data: { title: 'Gallery', showInNavbar: true, showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'gallery/detail/:id',
        component: GalleryDetailsComponent,
        data: { title: 'Details', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: false }
    },    
    {
        path: 'prints',
        component: PrintsComponent,
        data: { title: 'Prints', showInNavbar: true, showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'faq',
        component: FAQComponent,
        data: { title: 'FAQ', showInNavbar: true, showInFooterConnect: false, showInFooterInfo: false }
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contact', showInNavbar: false, showInFooterConnect: true, showInFooterInfo: false }
    },
    {
        path: 'archive',
        component: ArchiveComponent,
        data: { title: 'Archive', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: true }
    },
    {
        path: 'imprint',
        component: ImprintComponent,
        data: { title: 'Imprint', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: true }
    },
    {
        path: 'privacy',
        component: PrivacyComponent,
        data: { title: 'Privacy Policy', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: true }
    },
    {
        path: 'shipping',
        component: ShippingComponent,
        data: { title: 'Shipping', showInNavbar: false, showInFooterConnect: false, showInFooterInfo: true }
    }
];
