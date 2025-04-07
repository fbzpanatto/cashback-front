import { inject, Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { ErrorI } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  #error?: ErrorI
  #router = inject(Router)

  #statusObject: { [key: number]: () => Promise<boolean> } = {
    401: () => this.#router.navigate(['/login']),
    403: () => this.#router.navigate(['/login']),
  };

  handler = async (error: ErrorI) => {
    this.error = error;
    const action = this.#statusObject[error.status];
    if (action) { await action() }
    return this.error
  }

  get error() { return this.#error }
  set error(error: ErrorI | undefined) { this.#error = error }
}
