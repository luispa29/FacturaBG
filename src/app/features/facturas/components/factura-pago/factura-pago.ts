import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select, InputText, Button } from '@shared/components';
import { FormaPagoService } from '../../services/forma-pago.service';
import { FacturaPagoRequest, FormaPago } from '@models/interfaces';

@Component({
    selector: 'app-factura-pago',
    standalone: true,
    imports: [CommonModule, FormsModule, Select, InputText, Button],
    templateUrl: './factura-pago.html',
    styleUrl: './factura-pago.css'
})
export class FacturaPago implements OnInit {
    @Input() pagos: FacturaPagoRequest[] = [];
    @Input() totalFactura: number = 0;
    @Output() onAddPago = new EventEmitter<FacturaPagoRequest>();
    @Output() onRemovePago = new EventEmitter<number>();

    private formaPagoService = inject(FormaPagoService);

    formasPagoOptions = signal<{ label: string, value: number }[]>([]);

    // Modelos para el nuevo pago
    nuevaFormaPagoID = signal<number | null>(null);
    monto = signal<number>(0);
    referencia = signal<string>('');

    ngOnInit(): void {
        this.cargarFormasPago();
    }

    private cargarFormasPago(): void {
        this.formaPagoService.obtenerFormasPago().subscribe({
            next: (res) => {
                this.formasPagoOptions.set(
                    res.datos.map(f => ({ label: f.nombre, value: f.formaPagoID }))
                );
            }
        });
    }

    agregarPago(): void {
        if (!this.nuevaFormaPagoID() || this.monto() <= 0) return;

        this.onAddPago.emit({
            formaPagoID: this.nuevaFormaPagoID()!,
            monto: this.monto(),
            referencia: this.referencia() || null
        });

        // Reset local
        this.monto.set(0);
        this.referencia.set('');
    }

    eliminarPago(index: number): void {
        this.onRemovePago.emit(index);
    }

    get totalPagado(): number {
        return this.pagos.reduce((acc, p) => acc + Number(p.monto), 0);
    }

    get saldoRestante(): number {
        return Math.max(0, this.totalFactura - this.totalPagado);
    }
}
