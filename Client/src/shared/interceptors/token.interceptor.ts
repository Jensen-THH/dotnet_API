import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  var authService = inject(AuthService);

  if (authService.getToken()) {
    var cloned = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + authService.getToken()
      )
    })
    return next(cloned);
  }
  return next(req)
};
