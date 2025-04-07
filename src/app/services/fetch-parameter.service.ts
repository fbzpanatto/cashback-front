import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, firstValueFrom } from "rxjs";
import { ErrorI, Parameter, SuccessGetParameterI, SuccessPutI } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class FetchParameterService {

  #http = inject(HttpClient)
  #errorHandler = inject(ErrorHandlerService)

  async getParameter() {
    return await firstValueFrom(
      this.#http.get<SuccessGetParameterI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}`)
        .pipe(
          catchError(async ({error}) => await this.#errorHandler.handler(error))
        )
    )
  }

  async putParameter(parameter: Parameter) {
    await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}/${parameter.id}`, parameter)
        .pipe(
          catchError(async ({error}) => await this.#errorHandler.handler(error))
        )
    )
  }
}
