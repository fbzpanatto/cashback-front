import { inject, Injectable } from '@angular/core';
import { catchError, firstValueFrom } from "rxjs";
import { Credentials, ErrorI, SuccessPostLogin } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { DialogService } from "./dialog.service";

@Injectable({
  providedIn: 'root'
})
export class FetchLoginService {

  #http = inject(HttpClient)
  #dialog = inject(DialogService)

  async saveData(body: Partial<Credentials>) {
    return await firstValueFrom(
      this.#http.post<SuccessPostLogin>(`${environment.API_URL}${environment.LOGIN}`, body)
        .pipe(
          catchError(async ({error}) => {
            if (error.status === 401) {
              const source$ = this.#dialog.open({title: 'Alerta', message: 'Credenciais inválidas', actions: false}).afterClosed()
              await firstValueFrom(source$)
            }
            return error as ErrorI
          })
        )
    )
  }
}
