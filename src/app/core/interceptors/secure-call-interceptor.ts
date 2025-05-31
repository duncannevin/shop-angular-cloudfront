import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

const SECURE_ENDPOINTS = ['products/import'];

@Injectable()
export class SecureCallInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const url = new URL(request.url);
    const endpoint = url.pathname;
    console.log(
      `SecureCallInterceptor: Intercepting request to "${url.pathname}"`,
    );

    if (
      SECURE_ENDPOINTS.some((secureEndpoint) =>
        endpoint.includes(secureEndpoint),
      )
    ) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.notificationService.showError(
          `You must be logged in to access "${url.pathname}". Please log in and try again.`,
          0,
        );
        return throwError(
          () => new Error(`Unauthorized access to "${url.pathname}"`),
        );
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      tap({
        error: () => {
          this.notificationService.showError(
            `Request to "${url.pathname}" failed. Check the console for the details`,
            0,
          );
        },
      }),
    );
  }
}
