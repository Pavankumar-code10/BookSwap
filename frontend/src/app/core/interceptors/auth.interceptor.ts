import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Only intercept requests to our API
        if (!req.url.includes('/api')) {
            return next.handle(req);
        }

        return from(this.authService.getIdToken()).pipe(
            switchMap(token => {
                if (token) {
                    const cloned = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return next.handle(cloned);
                }
                return next.handle(req);
            })
        );
    }
}
