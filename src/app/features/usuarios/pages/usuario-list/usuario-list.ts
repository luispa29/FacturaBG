import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, Button, InputText, Select, AppTemplate } from '@shared/components';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, PaginacionParams, ApiResponse, PaginationData, PageEvent } from '@models/interfaces';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-usuario-list',
    standalone: true,
    imports: [CommonModule, FormsModule, Table, Button, InputText, Select, AppTemplate],
    templateUrl: './usuario-list.html',
    styleUrl: './usuario-list.css'
})
export class UsuarioList implements OnInit {
    private usuarioService = inject(UsuarioService);
    private messageService = inject(MessageService);

    // Estado de los datos
    usuarios = signal<Usuario[]>([]);
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
        { field: 'usuarioID', header: 'ID', sortable: true, width: '80px' },
        { field: 'username', header: 'Usuario', sortable: true },
        { field: 'nombre', header: 'Nombre Completo', sortable: true },
        { field: 'email', header: 'Email', sortable: true },
        { field: 'activo', header: 'Estado', sortable: true, width: '120px' },
        { field: 'fechaCreacion', header: 'Fecha Creación', sortable: true, width: '180px' },
        { field: 'acciones', header: 'ACCIONES', sortable: false, width: '120px' }
    ];

    ngOnInit(): void {
        this.cargarUsuarios();
    }

    cargarUsuarios(event?: PageEvent): void {
        this.loading.set(true);

        if (event) {
            this.pagination.update(p => ({ ...p, page: event.page, pageSize: event.pageSize }));
        }

        const params: PaginacionParams = {
            numeroPagina: this.pagination().page,
            tamanoPagina: this.pagination().pageSize,
            filtro: this.filtroTexto(),
            soloActivos: this.filtroEstado() === null ? undefined : this.filtroEstado()!,
            columnaOrden: 'usuarioID',
            ordenAscendente: false
        };

        this.usuarioService.obtenerUsuarios(params).subscribe({
            next: (response: ApiResponse<Usuario[]>) => {
                this.usuarios.set(response.datos);
                this.pagination.update(p => ({
                    ...p,
                    totalRecords: response.paginacion?.totalRegistros || 0
                }));
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los usuarios'
                });
            }
        });
    }

    onSearch(): void {
        const texto = this.filtroTexto();
        // Solo buscar si está vacío (limpiar búsqueda) o si tiene 4 o más caracteres
        if (texto.length === 0 || texto.length >= 4) {
            this.cargarUsuarios();
        }
    }

    onEstadoChange(): void {
        this.cargarUsuarios();
    }

    nuevoUsuario(): void {
        // Lógica para abrir modal o navegar a creación
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Funcionalidad de creación próximamente'
        });
    }

    editarUsuario(usuario: Usuario): void {
        // Lógica para editar
    }

    eliminarUsuario(usuario: Usuario): void {
        // Lógica para eliminar
    }
}
