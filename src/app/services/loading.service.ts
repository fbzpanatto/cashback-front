import { Injectable, signal } from '@angular/core';
import { concatMap, finalize, Observable, of, Subject, takeUntil, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  #loadingSignal = signal(false)

  cancelRequestSubject = new Subject<void>();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.setLoadingSignal(true)),
        concatMap(() => obs$ as Observable<T>),
        takeUntil(this.cancelRequestSubject),
        finalize(() => this.setLoadingSignal(false))
      )
  }

  setLoadingSignal(boolean: boolean) { this.#loadingSignal.update(value => value = boolean) }

  get loadingSignal() { return this.#loadingSignal.asReadonly() }

  cancelRequest() {
    this.cancelRequestSubject.next()
  }
}
