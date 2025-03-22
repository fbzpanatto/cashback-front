import { inject, Injectable, signal } from '@angular/core';
import { ErrorInterface, Register } from "../interfaces/interfaces";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { catchError, map, of } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  #data = signal<Register[]>([])

  #http = inject(HttpClient)

  async qrCode<T>() {
    return this.#http.get<{ status: number, object: T }>(`${environment.API_URL}${environment.WHATSAPP}`)
      .pipe(
        map((res) => res.object),
        catchError((err: ErrorInterface) => this.errorHandler(err))
      );
  }

  errorHandler(error: ErrorInterface) {
    console.log(error)
    return of(null)
  }

  async update(id: string, fields: Partial<Register>) {

    const index = this.#data().findIndex(element => element.id === id);

    if (index > -1) {
      const newArray = [
        ...this.#data().slice(0, index),
        { ...this.#data()[index], ...fields },
        ...this.#data().slice(index + 1)
      ];

      this.updateSignal(newArray)
    }
  }

  get data(){ return this.#data.asReadonly() }

  updateSignal(data: Register[]) { this.#data.update((_) => [...data]) }
}
