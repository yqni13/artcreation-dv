import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {title: 'Home', showInNavbar: true, showInFooter: false }
    },
    // {
    //     path: 'about',
    //     component: demo,
    //     title: 'About'
    // },
    // {
    //     path: 'contact',
    //     component: demo,
    //     title: 'Contact'
    // },
    // {
    //     path: 'faq',
    //     component: demo,
    //     title: 'FAQ'
    // },
    // {
    //     path: 'gallery',
    //     component: demo,
    //     title: 'Gallery'
    // },
    // {
    //     path: 'imprint',
    //     component: demo,
    //     title: 'Imprint'
    // },
    // {
    //     path: 'privacy',
    //     component: demo,
    //     title: 'Privacy'
    // },
];
