import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputText, Select, Button } from '@shared/components';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioRequest, UsuarioUpdateRequest, ApiResponse, Usuario } from '@models/interfaces';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-usuario-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputText, Select, Button],
    templateUrl: './usuario-form.html',
    styleUrl: './usuario-form.css'
})
export class UsuarioForm implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private usuarioService = inject(UsuarioService);
    private messageService = inject(MessageService);

    form!: FormGroup;
    isEdit = signal(false);
    usuarioId = signal<number | null>(null);
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
            username: ['', [Validators.required, Validators.minLength(4)]],
            contrasena: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            activo: [true, [Validators.required]],
            actualizarContrasena: [false]
        });

        // Vigilamos el check de actualizar contraseña en edición
        this.form.get('actualizarContrasena')?.valueChanges.subscribe(val => {
            const passControl = this.form.get('contrasena');
            if (val) {
                passControl?.setValidators([Validators.required]);
            } else {
                passControl?.clearValidators();
            }
            passControl?.updateValueAndValidity();
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEdit.set(true);
            this.usuarioId.set(Number(id));
            this.cargarUsuario(Number(id));

            // En edición, la contraseña no es requerida a menos que se marque "actualizar"
            this.form.get('contrasena')?.clearValidators();
            this.form.get('contrasena')?.updateValueAndValidity();
        }
    }

    private cargarUsuario(id: number): void {
        const state = window.history.state;
        if (state && state.usuario) {
            const usuario = state.usuario as Usuario;
            this.form.patchValue({
                username: usuario.username,
                nombre: usuario.nombre,
                email: usuario.email,
                activo: usuario.activo,
                actualizarContrasena: false
            });
        } else {
            // Si no hay datos en el estado (ej. refresh), volvemos al listado
            // O podríamos opcionalmente mostrar un error
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Datos de edición no disponibles, volviendo al listado'
            });
            this.router.navigate(['/usuarios']);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        const formValue = this.form.value;

        if (this.isEdit()) {
            const request: UsuarioUpdateRequest = {
                id: this.usuarioId()!,
                username: formValue.username,
                nuevaContrasena: formValue.actualizarContrasena ? formValue.contrasena : null,
                nombre: formValue.nombre,
                email: formValue.email,
                activo: formValue.activo,
                actualizarContrasena: formValue.actualizarContrasena
            };

            this.usuarioService.actualizarUsuario(request).subscribe({
                next: () => this.handleSuccess('Usuario actualizado correctamente'),
                error: () => this.handleError()
            });
        } else {
            const request: UsuarioRequest = {
                id: 0,
                username: formValue.username,
                contrasena: formValue.contrasena,
                nombre: formValue.nombre,
                email: formValue.email,
                activo: formValue.activo
            };

            this.usuarioService.crearUsuario(request).subscribe({
                next: () => this.handleSuccess('Usuario creado correctamente'),
                error: () => this.handleError()
            });
        }
    }

    private handleSuccess(message: string): void {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
        this.router.navigate(['/usuarios']);
    }

    private handleError(): void {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar la operación' });
    }

    cancelar(): void {
        this.router.navigate(['/usuarios']);
    }
}
