import { inject, Injectable } from '@angular/core';
import { catchError, tap } from "rxjs";
import { Credentials, ErrorI, SuccessPostLogin } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { DialogService } from "./dialog.service";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class FetchLoginService {

  #http = inject(HttpClient)
  #dialog = inject(DialogService)
  #loading = inject(LoadingService);

  postLogin(body: Partial<Credentials>) {
    const observable$ = this.#http.post<SuccessPostLogin>(`${environment.API_URL}${environment.LOGIN}`, body)
      .pipe(
        catchError(async ({ error: object }) => {
          if (object.status === 401) { this.#dialog.open({title: 'Alerta', message: object.error, actions: false}) }
          return object as ErrorI
        })
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  renewPassword(body: Partial<Credentials>) {
    const observable$ = this.#http.post<SuccessPostLogin>(`${environment.API_URL}${environment.RENEW_PASSWD}`, body)
      .pipe(
        catchError(async ({ error: object }) => {
          if (object.status === 401) { this.#dialog.open({title: 'Alerta', message: object.error, actions: false}) }
          return object as ErrorI
        })
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  resetPassword(body: Partial<Credentials>) {
    const observable$ = this.#http.post<SuccessPostLogin>(`${environment.API_URL}${environment.RESET_PASSWD}`, body)
      .pipe(
        tap(async ({ message }) => {
          this.#dialog.open({ title: 'Alerta', message, actions: false }).afterClosed()
        }),
        catchError(async ({ error: object }) => {
          if (object.status === 401) { this.#dialog.open({ title: 'Alerta', message: object.error, actions: false }) }
          return object as ErrorI
        })
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }
}
