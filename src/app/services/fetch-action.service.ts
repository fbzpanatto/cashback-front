import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import { Action, ErrorI, SuccessGetActionI, SuccessPutI } from "../interfaces/interfaces";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class FetchActionService {

  #http = inject(HttpClient)
  #errorHandler = inject(ErrorHandlerService)

  async getActions() {
    return await firstValueFrom(
      this.#http.get<SuccessGetActionI | ErrorI>(`${environment.API_URL}${environment.ACTION}`)
        .pipe(
          catchError(async ({ error }) => await this.#errorHandler.handler(error))
        )
    )
  }

  async putAction(body: { data: Action[] }) {
    await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.ACTION}`, body)
        .pipe(
          catchError(async ({ error }) => await this.#errorHandler.handler(error))
        )
    )
  }
}
