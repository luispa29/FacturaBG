import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpService } from '@core/services';
import { API_ENDPOINTS, APP_CONSTANTS } from '@core/constants';
import {
    LoginRequest,
    ApiResponse,
    LoginResponse
} from '@models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpService);

    login(userName: string, contrasena: string): Observable<ApiResponse<LoginResponse>> {
        const params: LoginRequest = { userName, contrasena };
        return this.http.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, null, params).pipe(
            tap(response => {
                if (response.datos?.token) {
                    this.guardarToken(response.datos.token);
                    this.guardarUsuario(response.datos.usuario);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    }

    obtenerToken(): string | null {
        return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    }

    estaAutenticado(): boolean {
        return this.obtenerToken() !== null;
    }

    private guardarToken(token: string): void {
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN, token);
    }

    private guardarUsuario(usuario: any): void {
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(usuario));
    }
}
