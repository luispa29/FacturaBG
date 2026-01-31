import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputText, Select, Button } from '@shared/components';
import { ProductoService } from '../../services/producto.service';
import { ProductoRequest, ApiResponse, Producto } from '@models/interfaces';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-producto-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputText, Select, Button],
    templateUrl: './producto-form.html',
    styleUrl: './producto-form.css'
})
export class ProductoForm implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private productoService = inject(ProductoService);
    private messageService = inject(MessageService);

    form!: FormGroup;
    isEdit = signal(false);
    productoId = signal<number | null>(null);
    loading = signal(false);

    estadoOptions = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    ngOnInit(): void {
        this.initForm();
        this.checkEditMode();
    }

    private initForm(): void {
        this.form = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
            stockActual: [0, [Validators.required, Validators.min(0)]],
            activo: [true, [Validators.required]]
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEdit.set(true);
            this.productoId.set(Number(id));
            this.cargarProducto();
        }
    }

    private cargarProducto(): void {
        const state = window.history.state;
        if (state && state.producto) {
            const producto = state.producto as Producto;
            this.form.patchValue({
                nombre: producto.nombre,
                precioUnitario: producto.precioUnitario,
                stockActual: producto.stockActual,
                activo: producto.activo
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Datos de edición no disponibles, volviendo al listado'
            });
            this.router.navigate(['/productos']);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        const formValue = this.form.value;

        const request: ProductoRequest = {
            id: this.isEdit() ? this.productoId()! : 0,
            nombre: formValue.nombre,
            precioUnitario: formValue.precioUnitario,
            stockActual: formValue.stockActual
        };

        const action = this.isEdit()
            ? this.productoService.actualizarProducto(request)
            : this.productoService.crearProducto(request);

        action.subscribe({
            next: () => {
                const msg = this.isEdit() ? 'Producto actualizado correctamente' : 'Producto creado correctamente';
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
                this.router.navigate(['/productos']);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar la operación' });
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/productos']);
    }
}
