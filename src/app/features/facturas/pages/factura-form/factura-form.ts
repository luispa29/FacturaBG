import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import {
    FacturaInfo,
    FacturaDetalle,
    FacturaPago,
    ProductoSelector,
    DetalleVenta
} from '../../components/index';

import { FacturaService } from '../../services/factura.service';
import {
    FacturaRequest,
    FacturaDetalleRequest,
    FacturaPagoRequest,
    Producto
} from '@models/interfaces';
import { Button } from '@shared/components';

@Component({
    selector: 'app-factura-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FacturaInfo,
        FacturaDetalle,
        FacturaPago,
        ProductoSelector,
        Button
    ],
    templateUrl: './factura-form.html',
    styleUrl: './factura-form.css'
})
export class FacturaForm implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private facturaService = inject(FacturaService);
    private messageService = inject(MessageService);

    form!: FormGroup;
    loading = signal(false);
    showSelector = signal(false);

    // Estado de las listas (no reactivas en el form principal sino locales para pasarlas)
    detalles = signal<DetalleVenta[]>([]);
    pagos = signal<FacturaPagoRequest[]>([]);

    // Cálculos reactivos
    subtotal = computed(() => this.detalles().reduce((acc, d) => acc + d.subtotal, 0));
    iva = signal(0); // IVA siempre 0 según requerimiento
    total = computed(() => this.subtotal() + this.iva());

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.form = this.fb.group({
            clienteID: [null, [Validators.required]],
            vendedorID: [null, [Validators.required]],
            fechaFactura: [new Date().toISOString().split('T')[0], [Validators.required]]
        });
    }

    // --- Manejo de Productos ---
    abrirSelector(): void {
        this.showSelector.set(true);
    }

    onProductoSelected(event: { producto: Producto, cantidad: number, precioUnitario: number }): void {
        const { producto, cantidad, precioUnitario } = event;

        // Validar si ya existe el producto
        const index = this.detalles().findIndex(d => d.productoID === producto.productoID);

        if (index !== -1) {
            // Podríamos sumar o avisar. Por ahora avisamos o simplemente actualizamos.
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Producto ya estaba en la lista' });
            return;
        }

        const nuevoDetalle: DetalleVenta = {
            productoID: producto.productoID,
            nombreProducto: producto.nombre,
            cantidad,
            precioUnitario,
            subtotal: cantidad * precioUnitario
        };

        this.detalles.update(prev => [...prev, nuevoDetalle]);
        this.showSelector.set(false);
    }

    eliminarDetalle(detalle: DetalleVenta): void {
        this.detalles.update(prev => prev.filter(d => d.productoID !== detalle.productoID));
    }

    actualizarDetalle(detalle: DetalleVenta): void {
        this.detalles.update(prev => [...prev]); // Forzar actualización de computed
    }

    // --- Manejo de Pagos ---
    agregarPago(pago: FacturaPagoRequest): void {
        const montoNuevo = Number(pago.monto);
        const totalPagado = this.pagos().reduce((acc, p) => acc + Number(p.monto), 0);
        const saldo = this.total() - totalPagado;

        if (montoNuevo > saldo + 0.01) { // Pequeño margen por decimales
            this.messageService.add({
                severity: 'warn',
                summary: 'Pago excedido',
                detail: 'El monto ingresado supera el saldo pendiente'
            });
            return;
        }

        pago.monto = montoNuevo;
        this.pagos.update(prev => [...prev, pago]);
    }

    eliminarPago(index: number): void {
        this.pagos.update(prev => prev.filter((_, i) => i !== index));
    }

    // --- Registro Final ---
    registrarFactura(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete los datos generales' });
            return;
        }

        if (this.detalles().length === 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe agregar al menos un producto' });
            return;
        }

        const totalPagado = this.pagos().reduce((acc, p) => acc + p.monto, 0);
        if (Math.abs(totalPagado - this.total()) > 0.01) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en pagos',
                detail: 'El total de los pagos debe coincidir con el total de la factura'
            });
            return;
        }

        this.loading.set(true);

        const request: FacturaRequest = {
            id: 0,
            clienteID: this.form.value.clienteID,
            vendedorID: this.form.value.vendedorID,
            fechaFactura: new Date(this.form.value.fechaFactura),
            detalles: this.detalles().map(d => ({
                productoID: d.productoID,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            })),
            pagos: this.pagos()
        };

        this.facturaService.crearFactura(request).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Factura registrada correctamente' });
                this.router.navigate(['/facturas']);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la factura' });
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/facturas']);
    }
}
