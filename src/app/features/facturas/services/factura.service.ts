import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services';
import { API_ENDPOINTS } from '@core/constants';
import {
    FacturaRequest,
    ApiResponse,
    Factura,
    FacturaFiltroParams
} from '@models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class FacturaService {
    private http = inject(HttpService);

    obtenerFacturas(params?: FacturaFiltroParams): Observable<ApiResponse<Factura[]>> {
        return this.http.get<ApiResponse<Factura[]>>(API_ENDPOINTS.FACTURAS.BASE, params);
    }

    obtenerFacturaPorId(id: number): Observable<ApiResponse<Factura>> {
        return this.http.get<ApiResponse<Factura>>(API_ENDPOINTS.FACTURAS.BY_ID(id));
    }

    crearFactura(factura: FacturaRequest): Observable<ApiResponse<Factura>> {
        return this.http.post<ApiResponse<Factura>>(API_ENDPOINTS.FACTURAS.BASE, factura);
    }
}
