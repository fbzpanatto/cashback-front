import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from "rxjs";
import { Payload } from "../interfaces/interfaces";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated = false
  private _isAuthAsObservable$ = new BehaviorSubject(this.isAuthenticated)
  #router = inject(Router)

  unsubscribeSubject = new Subject<void>();

  completeLogin(login: Payload) {
    this.setLocalStorageItem(login)
      .then(() => { this.setValidCredentials(login) })
      .catch(e => console.log('loginError', e))
  }

  setLocalStorageItem(login: Payload) {
    return new Promise((resolve, reject) => {
      try {
        this.storageWrapper.setItem('role', String(login.admin))
        this.storageWrapper.setItem('token', login.token)
        this.storageWrapper.setItem('expiresIn', login.expiresIn)
        setTimeout(() => { resolve(true) }, 0 )
      } catch (error) { reject(error) }
    })
  }

  setValidCredentials(_: Payload) {
    this.isAuthenticated = true
    this._isAuthAsObservable$.next(this.isAuthenticated)
    this.#router.navigate(['/home']).then(_ => null)
  }

  logout(fromMenu?: boolean) {
    this.storageWrapper.removeItem(environment.ROLE)
    this.storageWrapper.removeItem(environment.TOKEN)
    this.storageWrapper.removeItem(environment.EXPIRES_IN)
    this.storageWrapper.clear()
    this.isAuthenticated = false
    this._isAuthAsObservable$.next(this.isAuthenticated)
    if(fromMenu) { history.replaceState({}, '', '/login') }

    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  get isAuthAsObservable$() { return this._isAuthAsObservable$.asObservable() }
  get isAuthSubject() { return this._isAuthAsObservable$ }
  get isAuthenticated() { return this._isAuthenticated }
  set isAuthenticated(value: boolean) { this._isAuthenticated = value }

  get token() { return this.storageWrapper.getItem(environment.TOKEN) }
  get expiresIn() { return this.storageWrapper.getItem(environment.EXPIRES_IN) }

  get validToken() {
    let tokenExists = !!this.storageWrapper.getItem(environment.TOKEN)
    let tokenExpired = this.isExpired()
    let result = this.isAuthenticated = tokenExists && !tokenExpired
    this._isAuthAsObservable$.next(result)
    return result
  }

  isExpired() {
    const expiresIn = this.expiresIn
    if (!expiresIn) { return true }
    const now = new Date().getTime()
    const expiresInDate = new Date(Number(expiresIn) * 1000).getTime()
    return now > expiresInDate
  }

  get storageWrapper() { return localStorage }
  get role() { return Number(this.storageWrapper.getItem(environment.ROLE)) }
}
