import { inject, Injectable } from '@angular/core';
import { ErrorI, Sale, SuccessDeleteI, SuccessGetSaleI, SuccessPostI, SuccessPutI } from "../interfaces/interfaces";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { catchError, takeUntil, tap} from "rxjs"
import { SalesSignalService } from "./sales-signal.service";
import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class FetchSaleService {

  #http = inject(HttpClient)
  #sales = inject(SalesSignalService)
  #errorService = inject(ErrorHandlerService);
  #authService = inject(AuthService);
  #loading = inject(LoadingService);

  get() {
    const observable$ = this.#http.get<SuccessGetSaleI | ErrorI>(`${environment.API_URL}${environment.SALE}`)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  getSalesByClient(clientId: number) {
    const observable$ = this.#http.get<SuccessGetSaleI | ErrorI>(`${environment.API_URL}${environment.REPORT_CLIENT}/${ clientId }`)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  post(data: Sale[]) {
    const observable$ = this.#http.post<SuccessPostI | ErrorI>(`${environment.API_URL}${environment.SALE}`, data)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  put(saleId: number | string, data: Partial<Sale>) {
    const observable$ = this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.SALE}/${ saleId }`, data)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  delete(saleId: number | string) {
    const observable$ = this.#http.delete<SuccessDeleteI | ErrorI>(`${environment.API_URL}${environment.SALE}/${ saleId }`)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError(({ error }) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }
}
