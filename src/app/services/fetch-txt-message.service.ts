import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, firstValueFrom } from "rxjs";
import { ErrorI, SuccessGetTxtMessageI, SuccessPutI, TextMessage } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class FetchTxtMessageService {

  #http = inject(HttpClient)
  #errorHandler = inject(ErrorHandlerService);

  async getMessage(actionDay: number) {
    return await firstValueFrom(
      this.#http.get<SuccessGetTxtMessageI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}?actionDay=${actionDay}`)
        .pipe(
          catchError(async ({error}) => await this.#errorHandler.handler(error))
        )
    )
  }

  async putMessage(message: TextMessage) {
    return await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}`, message)
        .pipe(
          catchError(async ({error}) => await this.#errorHandler.handler(error))
        )
    )
  }
}
