import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '@features/productos/services/producto.service';
import { Producto, PaginacionParams } from '@models/interfaces';
import { Table, InputText, Button, AppTemplate } from '@shared/components';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-producto-selector',
    standalone: true,
    imports: [CommonModule, FormsModule, Table, InputText, Button, AppTemplate],
    templateUrl: './producto-selector.html',
    styleUrl: './producto-selector.css'
})
export class ProductoSelector implements OnInit {
    @Output() onSelect = new EventEmitter<{ producto: Producto, cantidad: number, precioUnitario: number }>();
    @Output() onClose = new EventEmitter<void>();

    private productoService = inject(ProductoService);
    private messageService = inject(MessageService);

    productos = signal<Producto[]>([]);
    loading = signal(false);
    filtroTexto = signal('');

    productoSeleccionado = signal<Producto | null>(null);
    cantidad: number = 1;
    precioEditable: number = 0;

    columns = [
        { field: 'productoID', header: 'ID', width: '80px' },
        { field: 'nombre', header: 'Nombre' },
        { field: 'precioUnitario', header: 'Precio Unitario', width: '130px' },
        { field: 'stockActual', header: 'Stock Disponible', width: '150px' }
    ];

    ngOnInit(): void {
        this.cargarProductos();
    }

    cargarProductos(): void {
        this.loading.set(true);
        const params: PaginacionParams = {
            numeroPagina: 1,
            tamanoPagina: 50,
            filtro: this.filtroTexto() || undefined,
            soloActivos: true
        };

        this.productoService.obtenerProductos(params).subscribe({
            next: (res) => {
                this.productos.set(res.datos);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    seleccionarFila(producto: Producto): void {
        if (producto.stockActual <= 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Sin Stock',
                detail: 'Este producto no cuenta con existencias disponibles'
            });
            return;
        }
        this.productoSeleccionado.set(producto);
        this.precioEditable = producto.precioUnitario;
        this.cantidad = 1;
    }

    agregar(): void {
        const prod = this.productoSeleccionado();
        if (!prod) return;

        if (this.cantidad <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La cantidad debe ser mayor a 0' });
            return;
        }

        if (this.cantidad > prod.stockActual) {
            this.messageService.add({
                severity: 'error',
                summary: 'Exceso de cantidad',
                detail: `Solo hay ${prod.stockActual} unidades disponibles`
            });
            return;
        }

        this.onSelect.emit({
            producto: prod,
            cantidad: this.cantidad,
            precioUnitario: this.precioEditable
        });

        this.cerrar();
    }

    cerrar(): void {
        this.onClose.emit();
    }
}
