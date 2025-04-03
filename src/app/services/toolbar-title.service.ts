import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolbarTitleService {

  #title = signal('')
  #home = signal(true)
  #logout = signal(true)

  updateTitle(title: string) { this.#title.update((curr) => curr = title) }

  updateHome(value: boolean) { this.#home.update((curr) => curr = value) }

  updateLogout(value: boolean) { this.#logout.update((curr) => curr = value) }

  get home() { return this.#home.asReadonly() }

  get logout() { return this.#logout.asReadonly() }

  get title() { return this.#title.asReadonly() }
}
