import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services';
import { API_ENDPOINTS } from '@core/constants';
import {
    ClienteRequest,
    ApiResponse,
    Cliente,
    PaginacionParams
} from '@models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private http = inject(HttpService);

    obtenerClientes(params?: PaginacionParams): Observable<ApiResponse<Cliente[]>> {
        return this.http.get<ApiResponse<Cliente[]>>(API_ENDPOINTS.CLIENTES.BASE, params);
    }

    crearCliente(cliente: ClienteRequest): Observable<ApiResponse<Cliente>> {
        return this.http.post<ApiResponse<Cliente>>(API_ENDPOINTS.CLIENTES.BASE, cliente);
    }

    actualizarCliente(cliente: ClienteRequest): Observable<ApiResponse<Cliente>> {
        return this.http.put<ApiResponse<Cliente>>(API_ENDPOINTS.CLIENTES.BASE, cliente);
    }

    eliminarCliente(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(API_ENDPOINTS.CLIENTES.BY_ID(id));
    }
}
