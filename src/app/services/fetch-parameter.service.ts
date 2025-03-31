import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom} from "rxjs";
import { ErrorI, Parameter, SuccessGetParameterI, SuccessPutI } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FetchParameterService {

  #http = inject(HttpClient)

  async getParameter() {

    const response = await firstValueFrom(
      this.#http.get<SuccessGetParameterI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}`),
    )

    if((response as ErrorI).error) {
      return console.error('errorHandler', response)
    }

    return (response as SuccessGetParameterI).data
  }

  async putParameter(parameter: Parameter) {

    const response = await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}/${parameter.id}`, parameter)
    )

    if((response as ErrorI).error) {
      return console.error('errorHandler', response)
    }
  }
}
