import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import {
    Table,
    InputText,
    Button,
    Select,
    AppTemplate
} from '@shared/components';

import { FacturaService } from '../../services/factura.service';
import { ClienteService } from '@features/clientes/services/cliente.service';
import { UsuarioService } from '@features/usuarios/services/usuario.service';
import {
    Factura,
    FacturaParams,
    PaginationData,
    PageEvent,
    Cliente,
    Usuario
} from '@models/interfaces';

@Component({
    selector: 'app-factura-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Table,
        InputText,
        Button,
        Select,
        AppTemplate
    ],
    templateUrl: './factura-list.html',
    styleUrl: './factura-list.css'
})
export class FacturaList implements OnInit {
    private facturaService = inject(FacturaService);
    private clienteService = inject(ClienteService);
    private usuarioService = inject(UsuarioService);
    private router = inject(Router);

    public facturas = signal<Factura[]>([]);
    public loading = signal(false);
    public pagination = signal<PaginationData>({ page: 1, pageSize: 10, totalRecords: 0 });

    // Catálogos para filtros
    public clientesOptions = signal<{ label: string, value: number }[]>([]);
    public vendedoresOptions = signal<{ label: string, value: number }[]>([]);

    // Filtros
    public filtros = {
        numeroFactura: '',
        clienteID: null as number | null,
        vendedorID: null as number | null,
        montoDesde: null as number | null,
        montoHasta: null as number | null,
        fechaDesde: '',
        fechaHasta: ''
    };

    public columns = [
        { field: 'numeroFactura', header: 'NUMERO' },
        { field: 'fechaFactura', header: 'FECHA' },
        { field: 'clienteNombre', header: 'CLIENTE' },
        { field: 'vendedorNombre', header: 'VENDEDOR' },
        { field: 'total', header: 'TOTAL', width: '130px' },
        { field: 'activo', header: 'ESTADO', width: '100px' },
        { field: 'acciones', header: 'ACCIONES', width: '100px' }
    ];

    ngOnInit(): void {
        this.cargarCatalogos();
        this.cargarFacturas();
    }

    private cargarCatalogos(): void {
        const params = { numeroPagina: 1, tamanoPagina: 1000, soloActivos: true };
        forkJoin({
            clientes: this.clienteService.obtenerClientes(params),
            usuarios: this.usuarioService.obtenerUsuarios(params)
        }).subscribe({
            next: (res) => {
                this.clientesOptions.set(res.clientes.datos.map(c => ({ label: c.nombre, value: c.clienteID })));
                this.vendedoresOptions.set(res.usuarios.datos.map(u => ({ label: u.nombre, value: u.usuarioID })));
            }
        });
    }

    public cargarFacturas(event?: PageEvent): void {
        this.loading.set(true);
        if (event) {
            this.pagination.update(prev => ({ ...prev, page: event.page, pageSize: event.pageSize }));
        }

        const params: FacturaParams = {
            numeroPagina: this.pagination().page,
            tamanoPagina: this.pagination().pageSize,
            ...this.filtros,
            numeroFactura: this.filtros.numeroFactura || undefined,
            clienteID: this.filtros.clienteID || undefined,
            vendedorID: this.filtros.vendedorID || undefined,
            montoDesde: this.filtros.montoDesde || undefined,
            montoHasta: this.filtros.montoHasta || undefined,
            fechaDesde: this.filtros.fechaDesde || undefined,
            fechaHasta: this.filtros.fechaHasta || undefined
        };

        this.facturaService.obtenerFacturas(params).subscribe({
            next: (res) => {
                this.facturas.set(res.datos);
                if (res.paginacion) {
                    this.pagination.update(prev => ({
                        ...prev,
                        totalRecords: res.paginacion!.totalRegistros
                    }));
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    public limpiarFiltros(): void {
        this.filtros = {
            numeroFactura: '',
            clienteID: null,
            vendedorID: null,
            montoDesde: null,
            montoHasta: null,
            fechaDesde: '',
            fechaHasta: ''
        };
        this.cargarFacturas({ page: 1, pageSize: this.pagination().pageSize });
    }

    public nuevaFactura(): void {
        this.router.navigate(['/facturas/nueva']);
    }

    public verDetalle(factura: Factura): void {
        this.router.navigate(['/facturas/ver', factura.facturaID]);
    }
}
