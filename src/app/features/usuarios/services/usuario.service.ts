import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services';
import { API_ENDPOINTS } from '@core/constants';
import {
    UsuarioRequest,
    UsuarioUpdateRequest,
    ApiResponse,
    Usuario,
    PaginacionParams
} from '@models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private http = inject(HttpService);

    obtenerUsuarios(params?: PaginacionParams): Observable<ApiResponse<Usuario[]>> {
        return this.http.get<ApiResponse<Usuario[]>>(API_ENDPOINTS.USUARIOS.BASE, params);
    }

    crearUsuario(usuario: UsuarioRequest): Observable<ApiResponse<Usuario>> {
        return this.http.post<ApiResponse<Usuario>>(API_ENDPOINTS.USUARIOS.BASE, usuario);
    }

    actualizarUsuario(usuario: UsuarioUpdateRequest): Observable<ApiResponse<Usuario>> {
        return this.http.put<ApiResponse<Usuario>>(API_ENDPOINTS.USUARIOS.BASE, usuario);
    }

    eliminarUsuario(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(API_ENDPOINTS.USUARIOS.BY_ID(id));
    }
}
