import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, firstValueFrom } from "rxjs";
import { ErrorI, Parameter, SuccessGetParameterI, SuccessPutI } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FetchParameterService {

  #http = inject(HttpClient)
  #router = inject(Router)

  async getParameter() {
    return await firstValueFrom(
      this.#http.get<SuccessGetParameterI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}`)
        .pipe(
          catchError(async ({error}) => {
            if (error.status === 401) {
              await this.#router.navigate(['/login']);
            }
            return error as ErrorI
          })
        )
    )
  }

  async putParameter(parameter: Parameter) {
    await firstValueFrom(
      this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.PARAMETER}/${parameter.id}`, parameter)
        .pipe(
          catchError(async ({error}) => {
            if (error.status === 401) { await this.#router.navigate(['/login']) }
            return error as ErrorI
          })
        )
    )
  }
}
