import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from '@core/guards';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('@features/auth/pages/login/login').then(m => m.Login),
        canActivate: [noAuthGuard]
    },
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () => import('./app').then(m => m.App), // Usamos el AppComponent como placeholder por ahora
            }
        ],
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
