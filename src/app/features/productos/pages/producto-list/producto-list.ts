import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Table, Button, InputText, Select, AppTemplate } from '@shared/components';
import { ProductoService } from '../../services/producto.service';
import { Producto, PaginacionParams, ApiResponse, PaginationData, PageEvent } from '@models/interfaces';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-producto-list',
    standalone: true,
    imports: [CommonModule, FormsModule, Table, Button, InputText, Select, AppTemplate],
    templateUrl: './producto-list.html',
    styleUrl: './producto-list.css'
})
export class ProductoList implements OnInit {
    private productoService = inject(ProductoService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private router = inject(Router);

    // Estado de los datos
    productos = signal<Producto[]>([]);
    loading = signal(false);

    // Paginación
    pagination = signal<PaginationData>({
        page: 1,
        pageSize: 10,
        totalRecords: 0
    });

    // Filtros
    filtroTexto = signal('');
    filtroEstado = signal<boolean | null>(null);

    // Opciones para el filtro de estado
    estadoOptions = [
        { label: 'Activos', value: true },
        { label: 'Inactivos', value: false }
    ];

    // Configuración de columnas
    columns = [
        { field: 'productoID', header: 'ID', sortable: true, width: '80px' },
        { field: 'nombre', header: 'Nombre del Producto', sortable: true },
        { field: 'precioUnitario', header: 'Precio Unitario', sortable: true, width: '150px' },
        { field: 'stockActual', header: 'Stock Actual', sortable: true, width: '120px' },
        { field: 'activo', header: 'Estado', sortable: true, width: '120px' },
        { field: 'acciones', header: 'ACCIONES', sortable: false, width: '120px' }
    ];

    ngOnInit(): void {
        this.cargarProductos();
    }

    cargarProductos(event?: PageEvent): void {
        this.loading.set(true);

        if (event) {
            this.pagination.set({
                page: event.page,
                pageSize: event.pageSize,
                totalRecords: this.pagination().totalRecords
            });
        }

        const params: PaginacionParams = {
            numeroPagina: this.pagination().page,
            tamanoPagina: this.pagination().pageSize,
            filtro: this.filtroTexto().length >= 4 ? this.filtroTexto() : undefined,
            soloActivos: this.filtroEstado() === null ? undefined : this.filtroEstado()!,
            columnaOrden: 'productoID',
            ordenAscendente: false
        };

        this.productoService.obtenerProductos(params).subscribe({
            next: (res: ApiResponse<Producto[]>) => {
                this.productos.set(res.datos || []);
                if (res.paginacion) {
                    this.pagination.set({
                        page: res.paginacion.paginaActual,
                        pageSize: res.paginacion.tamanoPagina,
                        totalRecords: res.paginacion.totalRegistros
                    });
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los productos'
                });
            }
        });
    }

    onSearch(): void {
        if (this.filtroTexto().length === 0 || this.filtroTexto().length >= 4) {
            this.cargarProductos();
        }
    }

    onEstadoChange(): void {
        this.cargarProductos();
    }

    nuevoProducto(): void {
        this.router.navigate(['/productos/nuevo']);
    }

    editarProducto(producto: Producto): void {
        this.router.navigate(['/productos/editar', producto.productoID], { state: { producto } });
    }

    eliminarProducto(producto: Producto): void {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar el producto <b>${producto.nombre}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-text p-button-secondary',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.productoService.eliminarProducto(producto.productoID).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Producto eliminado correctamente'
                        });
                        this.cargarProductos();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el producto'
                        });
                    }
                });
            }
        });
    }
}
