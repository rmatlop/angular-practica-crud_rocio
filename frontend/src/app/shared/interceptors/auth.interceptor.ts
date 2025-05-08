import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const autorizationToken = 'Bearer ' + localStorage.getItem('auth-token');

  const newReq = req.clone({
    headers: req.headers.append('Authorization', autorizationToken),
  });
  return next(newReq);
}
