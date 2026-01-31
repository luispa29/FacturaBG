import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Table, Button, InputText, Select, AppTemplate } from '@shared/components';
import { ClienteService } from '../../services/cliente.service';
import { Cliente, PaginacionParams, ApiResponse, PaginationData, PageEvent } from '@models/interfaces';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-cliente-list',
    standalone: true,
    imports: [CommonModule, FormsModule, Table, Button, InputText, Select, AppTemplate],
    templateUrl: './cliente-list.html',
    styleUrl: './cliente-list.css'
})
export class ClienteList implements OnInit {
    private clienteService = inject(ClienteService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private router = inject(Router);

    // Estado de los datos
    clientes = signal<Cliente[]>([]);
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
        { field: 'clienteID', header: 'ID', sortable: true, width: '80px' },
        { field: 'identificacion', header: 'Identificación', sortable: true, width: '150px' },
        { field: 'nombre', header: 'Nombre Completo', sortable: true },
        { field: 'telefono', header: 'Teléfono', sortable: true, width: '150px' },
        { field: 'email', header: 'Email', sortable: true },
        { field: 'activo', header: 'Estado', sortable: true, width: '120px' },
        { field: 'fechaRegistro', header: 'Fecha Registro', sortable: true, width: '180px' },
        { field: 'acciones', header: 'ACCIONES', sortable: false, width: '120px' }
    ];

    ngOnInit(): void {
        this.cargarClientes();
    }

    cargarClientes(event?: PageEvent): void {
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
            columnaOrden: 'clienteID',
            ordenAscendente: false
        };

        this.clienteService.obtenerClientes(params).subscribe({
            next: (res: ApiResponse<Cliente[]>) => {
                this.clientes.set(res.datos || []);
                if (res.paginacion) {
                    this.pagination.update(p => ({
                        ...p,
                        totalRecords: res.paginacion?.totalRegistros || 0
                    }));
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los clientes'
                });
            }
        });
    }

    onSearch(): void {
        if (this.filtroTexto().length === 0 || this.filtroTexto().length >= 4) {
            this.cargarClientes();
        }
    }

    onEstadoChange(): void {
        this.cargarClientes();
    }

    nuevoCliente(): void {
        this.router.navigate(['/clientes/nuevo']);
    }

    editarCliente(cliente: Cliente): void {
        this.router.navigate(['/clientes/editar', cliente.clienteID], { state: { cliente } });
    }

    eliminarCliente(cliente: Cliente): void {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar al cliente <b>${cliente.nombre}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-text p-button-secondary',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.clienteService.eliminarCliente(cliente.clienteID).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Cliente eliminado correctamente'
                        });
                        this.cargarClientes();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar al cliente'
                        });
                    }
                });
            }
        });
    }
}
