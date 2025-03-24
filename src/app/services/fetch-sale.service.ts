import { inject, Injectable } from '@angular/core';
import {ErrorInterface, Sale, SuccessGetSaleInterface, SuccessPostInterface, SuccessPutInterface} from "../interfaces/interfaces";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { firstValueFrom } from "rxjs"
import { SalesSignalService } from "./sales-signal.service";

@Injectable({
  providedIn: 'root'
})
export class FetchSaleService {

  #http = inject(HttpClient)
  #sales = inject(SalesSignalService)

  async get() {
    const response = await firstValueFrom(
      this.#http.get<SuccessGetSaleInterface | ErrorInterface>(`${environment.API_URL}${environment.SALE}`),
    )

    if((response as ErrorInterface).error) {
      return console.error('errorHandler', response)
    }

    this.#sales.updateSignal((response as SuccessGetSaleInterface).data)
  }

  async post(data: Sale[]) {

    const response = await firstValueFrom(
      this.#http.post<SuccessPostInterface | ErrorInterface>(`${environment.API_URL}${environment.SALE}`, data)
    )

    if((response as ErrorInterface).error) {
      return console.error('errorHandler', response)
    }
  }

  async put(saleId: number | string, data: Partial<Sale>) {

    const response = await firstValueFrom(
      this.#http.put<SuccessPutInterface | ErrorInterface>(`${environment.API_URL}${environment.SALE}/${saleId}`, data)
    )

    if((response as ErrorInterface).error) {
      return console.error('errorHandler', response)
    }
  }
}
