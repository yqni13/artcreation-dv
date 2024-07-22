import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AboutComponent } from './modules/about/about.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home', showInNavbar: true, showInFooter: false }
    },
    {
        path: 'about',
        component: AboutComponent,
        data: { title: 'About', showInNavbar: true, showInFooter: false }
    },
    // {
    //     path: 'contact',
    //     component: demo,
    //     data: { title: 'Contact', showInNavbar: true, showInFooter: false }
    // },
    // {
    //     path: 'faq',
    //     component: demo,
    //     data: { title: 'Imprint', showInNavbar: false, showInFooter: true }
    // },
    // {
    //     path: 'gallery',
    //     component: demo,
    //     data: { title: 'Gallery', showInNavbar: true, showInFooter: false }
    // },
    // {
    //     path: 'imprint',
    //     component: demo,
    //     data: { title: 'Imprint', showInNavbar: false, showInFooter: true }
    // },
    // {
    //     path: 'privacy',
    //     component: demo,
    //     data: { title: 'Imprint', showInNavbar: false, showInFooter: true }
    // },
];
