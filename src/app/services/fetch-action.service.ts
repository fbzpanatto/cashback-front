import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import { Action, ErrorI, SuccessGetActionI, SuccessPutI } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class FetchActionService {

  #http = inject(HttpClient)

  async getActions() {

    const response = await firstValueFrom(
      this.#http.get<SuccessGetActionI | ErrorI>(`${environment.API_URL}${environment.ACTION}`),
    )

    if((response as ErrorI).error) {
      return console.error('errorHandler', response)
    }

    return (response as SuccessGetActionI).data
  }

  async putAction(body: { data: Action[] }) {

    const response = await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.ACTION}`, body)
    )

    if((response as ErrorI).error) {
      return console.error('errorHandler', response)
    }
  }
}
