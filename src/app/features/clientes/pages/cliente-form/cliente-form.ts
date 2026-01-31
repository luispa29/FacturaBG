import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputText, Select, Button } from '@shared/components';
import { ClienteService } from '../../services/cliente.service';
import { ClienteRequest, ApiResponse, Cliente } from '@models/interfaces';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-cliente-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputText, Select, Button],
    templateUrl: './cliente-form.html',
    styleUrl: './cliente-form.css'
})
export class ClienteForm implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private clienteService = inject(ClienteService);
    private messageService = inject(MessageService);

    form!: FormGroup;
    isEdit = signal(false);
    clienteId = signal<number | null>(null);
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
            identificacion: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            activo: [true, [Validators.required]]
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEdit.set(true);
            this.clienteId.set(Number(id));
            this.cargarCliente();
        }
    }

    private cargarCliente(): void {
        const state = window.history.state;
        if (state && state.cliente) {
            const cliente = state.cliente as Cliente;
            this.form.patchValue({
                identificacion: cliente.identificacion,
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                email: cliente.email,
                activo: cliente.activo
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Datos de edición no disponibles, volviendo al listado'
            });
            this.router.navigate(['/clientes']);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        const formValue = this.form.value;

        const request: ClienteRequest = {
            id: this.isEdit() ? this.clienteId()! : 0,
            identificacion: formValue.identificacion,
            nombre: formValue.nombre,
            telefono: formValue.telefono,
            email: formValue.email
        };

        const action = this.isEdit()
            ? this.clienteService.actualizarCliente(request)
            : this.clienteService.crearCliente(request);

        action.subscribe({
            next: () => {
                const msg = this.isEdit() ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente';
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
                this.router.navigate(['/clientes']);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar la operación' });
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/clientes']);
    }
}
