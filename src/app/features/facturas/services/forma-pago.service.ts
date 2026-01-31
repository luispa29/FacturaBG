import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services';
import { API_ENDPOINTS } from '@core/constants';
import { ApiResponse, FormaPago } from '@models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class FormaPagoService {
    private http = inject(HttpService);

    obtenerFormasPago(): Observable<ApiResponse<FormaPago[]>> {
        return this.http.get<ApiResponse<FormaPago[]>>(API_ENDPOINTS.FORMAS_PAGO.BASE);
    }
}
