import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@core/constants/app.constants';
import { ApiResponse, Factura, FacturaRequest, FacturaParams } from '@models/interfaces';
import { HttpService } from '@core/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class FacturaService {
    private http = inject(HttpService);

    obtenerFacturas(params: FacturaParams): Observable<ApiResponse<Factura[]>> {
        return this.http.get<ApiResponse<Factura[]>>(API_ENDPOINTS.FACTURAS.BASE, params);
    }

    obtenerFacturaPorId(id: number): Observable<ApiResponse<Factura>> {
        return this.http.get<ApiResponse<Factura>>(API_ENDPOINTS.FACTURAS.BY_ID(id));
    }

    crearFactura(factura: FacturaRequest): Observable<ApiResponse<Factura>> {
        return this.http.post<ApiResponse<Factura>>(API_ENDPOINTS.FACTURAS.BASE, factura);
    }
}
