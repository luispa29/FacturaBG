import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, Button, AppTemplate } from '@shared/components';
import { FacturaDetalleRequest, Producto } from '@models/interfaces';

export interface DetalleVenta extends FacturaDetalleRequest {
    nombreProducto: string;
    subtotal: number;
}

@Component({
    selector: 'app-factura-detalle',
    standalone: true,
    imports: [CommonModule, Table, Button, AppTemplate],
    templateUrl: './factura-detalle.html',
    styleUrl: './factura-detalle.css'
})
export class FacturaDetalle {
    @Input() detalles: DetalleVenta[] = [];
    @Output() onRemove = new EventEmitter<DetalleVenta>();
    @Output() onUpdate = new EventEmitter<DetalleVenta>();
    @Output() onAddProduct = new EventEmitter<void>();

    columns = [
        { field: 'nombreProducto', header: 'PRODUCTO (ID/NOMBRE)' },
        { field: 'cantidad', header: 'CANT.', width: '120px' },
        { field: 'precioUnitario', header: 'PRECIO UNIT.', width: '150px' },
        { field: 'subtotal', header: 'SUBTOTAL', width: '150px' },
        { field: 'acciones', header: 'ACCIÓN', width: '100px' }
    ];

    removeDetalle(detalle: DetalleVenta): void {
        this.onRemove.emit(detalle);
    }

    actualizarCantidad(detalle: DetalleVenta, nuevaCantidad: any): void {
        const cantidad = Number(nuevaCantidad);
        if (isNaN(cantidad) || cantidad <= 0) return;

        detalle.cantidad = cantidad;
        detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
        this.onUpdate.emit(detalle);
    }

    addProduct(): void {
        this.onAddProduct.emit();
    }
}
