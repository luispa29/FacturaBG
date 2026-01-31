import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

export const successInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse && event.status >= 200 && event.status < 300) {
                const body = event.body as any;

                if (body?.mensaje && req.method !== 'GET') {
                    messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: body.mensaje,
                        life: 3000
                    });
                }
            }
        })
    );
};
