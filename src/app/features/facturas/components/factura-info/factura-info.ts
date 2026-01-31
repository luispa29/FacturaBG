import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Select, InputText } from '@shared/components';
import { ClienteService } from '@features/clientes/services/cliente.service';
import { UsuarioService } from '@features/usuarios/services/usuario.service';
import { Cliente, Usuario, PaginacionParams } from '@models/interfaces';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-factura-info',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, Select, InputText],
    templateUrl: './factura-info.html',
    styleUrl: './factura-info.css'
})
export class FacturaInfo implements OnInit {
    @Input() form!: FormGroup;

    private clienteService = inject(ClienteService);
    private usuarioService = inject(UsuarioService);

    clientesOptions = signal<{ label: string, value: number }[]>([]);
    vendedoresOptions = signal<{ label: string, value: number }[]>([]);

    ngOnInit(): void {
        this.cargarCatalogos();
    }

    private cargarCatalogos(): void {
        const params: PaginacionParams = {
            numeroPagina: 1,
            tamanoPagina: 1000,
            soloActivos: true
        };

        forkJoin({
            clientes: this.clienteService.obtenerClientes(params),
            usuarios: this.usuarioService.obtenerUsuarios(params)
        }).subscribe({
            next: (res) => {
                this.clientesOptions.set(
                    res.clientes.datos.map(c => ({ label: `${c.identificacion} - ${c.nombre}`, value: c.clienteID }))
                );
                this.vendedoresOptions.set(
                    res.usuarios.datos.map(u => ({ label: `${u.usuarioID} - ${u.nombre}`, value: u.usuarioID }))
                );
            }
        });
    }
}
