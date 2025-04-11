import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, takeUntil } from "rxjs";
import { environment } from "../../environments/environment";
import { Action, ErrorI, SuccessGetActionI, SuccessPutI } from "../interfaces/interfaces";
import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class FetchActionService {

  #http = inject(HttpClient)
  #errorService = inject(ErrorHandlerService);
  #authService = inject(AuthService);
  #loading = inject(LoadingService);

  getActions() {
    const observable$ = this.#http.get<SuccessGetActionI | ErrorI>(`${environment.API_URL}${environment.ACTION}`)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  putAction(body: { data: Action[] }) {
    const observable$ = this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.ACTION}`, body)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }
}
