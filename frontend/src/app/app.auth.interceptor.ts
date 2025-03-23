import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './shared/services/token.service';
import { TokenOption } from './shared/enums/token-option.enum';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const token = tokenService.getToken(TokenOption.TOKEN);

    if (!token) {
        return next(req);
    }

    const reqClone = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(reqClone);
};