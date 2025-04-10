import { inject, Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { ErrorI } from "../interfaces/interfaces";
import { DialogService } from "./dialog.service";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  #error?: ErrorI
  #router = inject(Router)
  #dialog = inject(DialogService)

  getStatusObject(error: ErrorI): (() => void | Promise<boolean>) | undefined {
    const objectOfStatusHandler: Record<number, () => void | Promise<boolean>> = {
      401: () => this.#router.navigate(['/login']),
      403: () => this.#router.navigate(['/login']),
      500: () => {
        return new Promise<boolean>(async (resolve) => {
          await firstValueFrom(this.#dialog.open({ title: 'Alerta', message: error.error }).afterClosed());
          resolve(true);
        });
      }
    };

    return objectOfStatusHandler[error.status];
  }

  handler = async (error: ErrorI) => {
    this.error = error;
    const action = this.getStatusObject(error);
    if (action) { await action() }
    return this.error
  }

  get error() { return this.#error }
  set error(error: ErrorI | undefined) { this.#error = error }
}
