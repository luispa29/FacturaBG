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
        loadComponent: () => import('@shared/layout/main-layout/main-layout').then(m => m.MainLayout),
        canActivate: [authGuard],
        children: [
            {
                path: 'usuarios',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('@features/usuarios/pages/usuario-list/usuario-list').then(m => m.UsuarioList),
                    },
                    {
                        path: 'nuevo',
                        loadComponent: () => import('@features/usuarios/pages/usuario-form/usuario-form').then(m => m.UsuarioForm),
                    },
                    {
                        path: 'editar/:id',
                        loadComponent: () => import('@features/usuarios/pages/usuario-form/usuario-form').then(m => m.UsuarioForm),
                    }
                ]
            },
            {
                path: 'clientes',
                loadComponent: () => import('./app').then(m => m.App), // Placeholder
            },
            {
                path: 'productos',
                loadComponent: () => import('./app').then(m => m.App), // Placeholder
            },
            {
                path: 'facturas',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app').then(m => m.App), // Placeholder listado
                    },
                    {
                        path: 'nueva',
                        loadComponent: () => import('./app').then(m => m.App), // Placeholder nueva factura
                    }
                ]
            },
            {
                path: '',
                redirectTo: 'usuarios',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
