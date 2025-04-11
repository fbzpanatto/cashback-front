import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, takeUntil} from "rxjs";
import { ErrorI, Parameter, SuccessGetParameterI, SuccessPutI } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class FetchParameterService {

  #http = inject(HttpClient)
  #errorService = inject(ErrorHandlerService);
  #authService = inject(AuthService);
  #loading = inject(LoadingService);

  getParameter() {
    const observable$ = this.#http.get<SuccessGetParameterI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}`)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  putParameter(parameter: Parameter) {
    const observable$ = this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}/${parameter.id}`, parameter)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }
}
