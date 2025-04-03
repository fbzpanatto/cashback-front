import { Injectable, signal } from '@angular/core';
import { Sale } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class SalesSignalService {

  #salesSignal = signal<Sale[]>([])

  async updateSale(saleId: number | string, fields: Partial<Sale>) {

    const index = this.#salesSignal().findIndex(element => element.saleId === saleId);

    if (index > -1) {
      const newArray = [
        ...this.#salesSignal().slice(0, index),
        { ...this.#salesSignal()[index], ...fields },
        ...this.#salesSignal().slice(index + 1)
      ];

      this.updateSignal(newArray)
    }
  }

  async deleteSale(saleId: number | string) {

    const index = this.#salesSignal().findIndex(element => element.saleId === saleId)

    this.#salesSignal().splice(index, 1)
  }

  updateSignal(data: Sale[]) { this.#salesSignal.update((_) => [...data]) }

  get data(){ return this.#salesSignal.asReadonly() }
}
