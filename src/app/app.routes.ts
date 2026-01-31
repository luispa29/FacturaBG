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
                children: [
                    {
                        path: '',
                        loadComponent: () => import('@features/clientes/pages/cliente-list/cliente-list').then(m => m.ClienteList),
                    },
                    {
                        path: 'nuevo',
                        loadComponent: () => import('@features/clientes/pages/cliente-form/cliente-form').then(m => m.ClienteForm),
                    },
                    {
                        path: 'editar/:id',
                        loadComponent: () => import('@features/clientes/pages/cliente-form/cliente-form').then(m => m.ClienteForm),
                    }
                ]
            },
            {
                path: 'productos',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('@features/productos/pages/producto-list/producto-list').then(m => m.ProductoList),
                    },
                    {
                        path: 'nuevo',
                        loadComponent: () => import('@features/productos/pages/producto-form/producto-form').then(m => m.ProductoForm),
                    },
                    {
                        path: 'editar/:id',
                        loadComponent: () => import('@features/productos/pages/producto-form/producto-form').then(m => m.ProductoForm),
                    }
                ]
            },
            {
                path: 'facturas',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/facturas/pages/factura-list/factura-list').then(m => m.FacturaList),
                    },
                    {
                        path: 'nueva',
                        loadComponent: () => import('./features/facturas/pages/factura-form/factura-form').then(m => m.FacturaForm),
                    },
                    {
                        path: 'ver/:id',
                        loadComponent: () => import('./features/facturas/pages/factura-view/factura-view').then(m => m.FacturaView),
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
