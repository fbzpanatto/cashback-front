import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ErrorInterface, Message, SuccessPostInterface } from "../interfaces/interfaces";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FetchMessagesService {

  #http = inject(HttpClient)

  async post(data: Message) {

    const response = await firstValueFrom(
      this.#http.post<SuccessPostInterface | ErrorInterface>(`${environment.API_URL}${environment.WHATSAPP}/send-message`, data)
    )

    if((response as ErrorInterface).error) {
      return console.error('errorHandler', response)
    }

    return response
  }
}
