import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { LoadingService } from "./loading.service";
import { ErrorI, MarketingMessage, SuccessGetMarketingI, SuccessPutI } from "../interfaces/interfaces";
import { environment} from "../../environments/environment";
import { catchError, takeUntil } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FetchMarketingService {

  #http = inject(HttpClient);
  #errorService = inject(ErrorHandlerService);
  #authService = inject(AuthService);
  #loading = inject(LoadingService);

  getMessage(id: number) {

    const observable$ = this.#http.get<SuccessGetMarketingI | ErrorI>(`${environment.API_URL}${environment.MARKETING}/${ id }`)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError((error) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

  putMessage(message: MarketingMessage) {

    const observable$ = this.#http.put<SuccessPutI | ErrorI>(`${environment.API_URL}${environment.MARKETING}/${ message.id }`, message)
      .pipe(
        takeUntil(this.#authService.unsubscribeSubject),
        catchError((error) => this.#errorService.errorHandler(error))
      )
    return this.#loading.showLoaderUntilCompleted(observable$)
  }

}
