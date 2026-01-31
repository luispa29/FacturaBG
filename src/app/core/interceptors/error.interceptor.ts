import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let mensajeError = 'Ha ocurrido un error';
            let severity: 'error' | 'warn' = 'error';
            let summary = 'Error';


            if (error.status === 0) {
                mensajeError = 'Error de conexión. Verifique su conexión a internet';
            } else if (error.status === 400) {
                mensajeError = error.error?.mensaje || 'Error de validación. Verifique los datos ingresados';
                severity = 'warn';
                summary = 'Advertencia';
            } else if (error.status === 401) {
                mensajeError = 'Sesión expirada. Por favor, inicie sesión nuevamente';
                localStorage.clear();
                router.navigate(['/login']);
            } else if (error.status === 403) {
                mensajeError = 'No tiene permisos para realizar esta acción';
            } else if (error.status === 404) {
                mensajeError = 'Recurso no encontrado';
            } else if (error.status === 500) {
                mensajeError = 'Error interno del servidor';
            } else if (error.message) {
                mensajeError = error.message;
            }

            messageService.add({
                severity: severity,
                summary: summary,
                detail: mensajeError,
                life: 5000
            });

            return throwError(() => error);
        })
    );
};
