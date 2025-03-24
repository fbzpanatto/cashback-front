import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolbarTitleService {

  #title = signal('')

  updateTitle(title: string) { this.#title.update((curr) => curr = title) }

  get title() { return this.#title.asReadonly() }
}
