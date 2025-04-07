import { inject, Injectable } from '@angular/core';
import { ErrorI, Sale, SuccessDeleteI, SuccessGetSaleI, SuccessPostI, SuccessPutI } from "../interfaces/interfaces";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom, tap } from "rxjs"
import { SalesSignalService } from "./sales-signal.service";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class FetchSaleService {

  #http = inject(HttpClient)
  #sales = inject(SalesSignalService)
  #errorHandler = inject(ErrorHandlerService)

  async get() {
    return await firstValueFrom(
      this.#http.get<SuccessGetSaleI | ErrorI>(`${environment.API_URL}${environment.SALE}`)
        .pipe(
          tap(response => {
            if((response as SuccessGetSaleI).data) { this.#sales.updateSignal((response as SuccessGetSaleI).data) }
          }),
          catchError(async ({error}) => await this.#errorHandler.handler(error))
        )
    )
  }

  async getSalesByClient(clientId: number) {
    return await firstValueFrom(
      this.#http.get<SuccessGetSaleI | ErrorI>(`${environment.API_URL}${environment.REPORT_CLIENT}/${ clientId }`),
    )
  }

  async post(data: Sale[]) {
    await firstValueFrom(
      this.#http.post<SuccessPostI | ErrorI>(`${environment.API_URL}${environment.SALE}`, data)
        .pipe(catchError(async ({error}) => await this.#errorHandler.handler(error)))
    )
  }

  async put(saleId: number | string, data: Partial<Sale>) {
    await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.SALE}/${ saleId }`, data)
        .pipe(catchError(async ({error}) => await this.#errorHandler.handler(error)))
    )
  }

  async delete(saleId: number | string) {
    await firstValueFrom(
      this.#http.delete<SuccessDeleteI | ErrorI>(`${environment.API_URL}${environment.SALE}/${ saleId }`)
        .pipe(catchError(async ({error}) => await this.#errorHandler.handler(error)))
    )
  }
}
