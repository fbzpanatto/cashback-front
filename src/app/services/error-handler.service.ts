import { inject, Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { ErrorI } from "../interfaces/interfaces";
import { DialogService } from "./dialog.service";
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  #router = inject(Router)
  #dialog = inject(DialogService)

  errorHandler(error: ErrorI) {

    if(error.status !== 500) {
      switch (error.status) {

        case 401: {
          this.#router.navigate(['/login']).then(() => null)
          return of(error)
        }

        case 403: {
          this.#router.navigate(['/login']).then(() => null)
          return of(error)
        }

      }
    }

    this.#dialog.open({ title: 'Alerta', message: error.error, actions: false })
    return of(error)
  }
}
