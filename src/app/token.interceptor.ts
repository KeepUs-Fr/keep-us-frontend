import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { BehaviorSubject, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnackBarService } from './services/snack-bar.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private authService: AuthService,
        private snackBarService: SnackBarService
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request).pipe(
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse &&
                    !request.url.includes('auth/login') &&
                    error.status === 401
                ) {
                    return this.handle401Error(request, next);
                }
                return throwError(error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            const token = this.authService.getToken();

            if (token)
                return this.authService.refresh().pipe(
                    switchMap(
                        (result: { token: string; refreshKey: string }) => {
                            this.isRefreshing = false;
                            localStorage.setItem('token', result.token);
                            this.refreshTokenSubject.next(result.token);

                            return next.handle(
                                request.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${result.token}`
                                    }
                                })
                            );
                        }
                    ),
                    catchError((err) => {
                        this.isRefreshing = false;
                        return throwError(err);
                    })
                );
        }

        if (request.url.includes('auth/refresh')) {
            this.isRefreshing = false;
            this.authService.logout();
            this.snackBarService.openSuccess(
                'Your session has expired'
            );
            return throwError(request.body);
        }

        return this.refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => next.handle(
                request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ))
        );
    }
}
