import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Payload} from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated = false
  private _isAuthAsObservable$ = new BehaviorSubject(this.isAuthenticated)

  completeLogin(login: Payload) {

  }

  get validToken() {
    return ''
  }

  get isAuthAsObservable$() { return this._isAuthAsObservable$.asObservable() }
  get isAuthSubject() { return this._isAuthAsObservable$ }
  get isAuthenticated() { return this._isAuthenticated }
  set isAuthenticated(value: boolean) { this._isAuthenticated = value }

}
