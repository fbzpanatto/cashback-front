import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, takeUntil } from "rxjs";
import { ErrorI, SuccessGetTxtMessageI, SuccessPutI, TextMessage } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class FetchTxtMessageService {

  #http = inject(HttpClient);
  #errorService = inject(ErrorHandlerService);
  #authService = inject(AuthService);
  #loading = inject(LoadingService);

  getMessage(actionDay: number) {

    const observable$ = this.#http.get<SuccessGetTxtMessageI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}/${ actionDay }`)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError((error) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  putMessage(message: TextMessage) {

    const observable$ = this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}/${ message.id }`, message)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError((error) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }
}
