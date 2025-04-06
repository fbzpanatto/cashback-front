import { HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const token = authService.validToken;
  if (!token) { return next(req) }
  return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${ authService.token }`)}))
}
