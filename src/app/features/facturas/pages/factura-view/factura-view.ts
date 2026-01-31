import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from '../../services/factura.service';
import { Factura } from '@models/interfaces';
import { Button, Table, AppTemplate } from '@shared/components';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-factura-view',
    standalone: true,
    imports: [CommonModule, Button, Table, AppTemplate],
    templateUrl: './factura-view.html',
    styleUrl: './factura-view.css'
})
export class FacturaView implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private facturaService = inject(FacturaService);
    private messageService = inject(MessageService);

    public factura = signal<Factura | null>(null);
    public loading = signal(true);

    public detalleColumns = [
        { field: 'productoNombre', header: 'PRODUCTO' },
        { field: 'cantidad', header: 'CANT.', width: '100px' },
        { field: 'precioUnitario', header: 'PRECIO UNIT.', width: '150px' },
        { field: 'subtotal', header: 'SUBTOTAL', width: '150px' },
        { field: 'iva', header: 'IVA', width: '120px' },
        { field: 'total', header: 'TOTAL', width: '150px' }
    ];

    public pagoColumns = [
        { field: 'formaPagoNombre', header: 'FORMA DE PAGO' },
        { field: 'referencia', header: 'REFERENCIA' },
        { field: 'monto', header: 'MONTO', width: '150px' }
    ];

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.cargarFactura(id);
        } else {
            this.router.navigate(['/facturas']);
        }
    }

    private cargarFactura(id: number): void {
        this.loading.set(true);
        this.facturaService.obtenerFacturaPorId(id).subscribe({
            next: (res) => {
                this.factura.set(res.datos);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar la factura'
                });
                this.router.navigate(['/facturas']);
                this.loading.set(false);
            }
        });
    }

    public volver(): void {
        this.router.navigate(['/facturas']);
    }

    public imprimir(): void {
        window.print();
    }
}
