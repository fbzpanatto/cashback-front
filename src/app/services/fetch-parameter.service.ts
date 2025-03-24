import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom} from "rxjs";
import {ErrorInterface, Parameter, SuccessGetParameterInterface, SuccessPutInterface} from "../interfaces/interfaces";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FetchParameterService {

  #http = inject(HttpClient)

  async getParameter() {

    const response = await firstValueFrom(
      this.#http.get<SuccessGetParameterInterface | ErrorInterface>(`${environment.API_URL}${environment.PARAMETER}/1`),
    )

    if((response as ErrorInterface).error) {
      return console.error('errorHandler', response)
    }

    return (response as SuccessGetParameterInterface).data
  }

  async putParameter(parameter: Parameter) {

    const response = await firstValueFrom(
      this.#http.put<SuccessPutInterface | ErrorInterface>(`${environment.API_URL}${environment.PARAMETER}/${parameter.id}`, parameter)
    )

    if((response as ErrorInterface).error) {
      return console.error('errorHandler', response)
    }
  }
}
