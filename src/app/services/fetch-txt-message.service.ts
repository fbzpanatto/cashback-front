import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ErrorI, SuccessGetTxtMessageI, SuccessPutI, TextMessage } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FetchTxtMessageService {

  #http = inject(HttpClient)

  async getMessage() {

    const response = await firstValueFrom(
      this.#http.get<SuccessGetTxtMessageI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}`),
    )

    if((response as ErrorI).error) {
      return console.error('errorHandler', response)
    }

    return (response as SuccessGetTxtMessageI).data
  }

  async putMessage(message: TextMessage) {

    const response = await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}/${message.id}`, message)
    )

    if((response as ErrorI).error) {
      return console.error('errorHandler', response)
    }
  }
}
