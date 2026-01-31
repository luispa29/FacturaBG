import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services';
import { API_ENDPOINTS } from '@core/constants';
import {
    ProductoRequest,
    ApiResponse,
    Producto,
    PaginacionParams
} from '@models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private http = inject(HttpService);

    obtenerProductos(params?: PaginacionParams): Observable<ApiResponse<Producto[]>> {
        return this.http.get<ApiResponse<Producto[]>>(API_ENDPOINTS.PRODUCTOS.BASE, params);
    }

    crearProducto(producto: ProductoRequest): Observable<ApiResponse<Producto>> {
        return this.http.post<ApiResponse<Producto>>(API_ENDPOINTS.PRODUCTOS.BASE, producto);
    }

    actualizarProducto(producto: ProductoRequest): Observable<ApiResponse<Producto>> {
        return this.http.put<ApiResponse<Producto>>(API_ENDPOINTS.PRODUCTOS.BASE, producto);
    }

    eliminarProducto(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(API_ENDPOINTS.PRODUCTOS.BY_ID(id));
    }
}
