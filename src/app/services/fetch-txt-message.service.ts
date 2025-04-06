import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, firstValueFrom } from "rxjs";
import { ErrorI, SuccessGetTxtMessageI, SuccessPutI, TextMessage } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FetchTxtMessageService {

  #http = inject(HttpClient)
  #router = inject(Router)

  async getMessage() {
    return await firstValueFrom(
      this.#http.get<SuccessGetTxtMessageI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}`)
        .pipe(
          catchError(async ({error}) => {
            if (error.status === 401) { await this.#router.navigate(['/login']) }
            return error as ErrorI
          })
        )
    )
  }

  async putMessage(message: TextMessage) {
    await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.MESSAGE}/${message.id}`, message)
        .pipe(
          catchError(async ({error}) => {
            if (error.status === 401) { await this.#router.navigate(['/login']) }
            return error as ErrorI
          })
        )
    )
  }
}
