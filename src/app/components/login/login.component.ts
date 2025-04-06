import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule} from "@angular/material/icon";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, map, Observable, tap } from "rxjs";
import { confirmPassValidation, passwordStrengthValidator } from "../../utils/validators";
import { Credentials, ErrorI, SuccessPostLogin } from "../../interfaces/interfaces";
import { FetchLoginService } from "../../services/fetch-login.service";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatCardModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  isPasswordType = true;

  #resetToken: string = ''
  #fb = inject(FormBuilder);
  #fetch = inject(FetchLoginService);
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);
  #router = inject(Router)

  resetPassToken$?: Observable<string>

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator()]],
  });

  resetPasswordForm = this.#fb.group({
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ['', [Validators.required, passwordStrengthValidator()]],
  }, { validators: [confirmPassValidation()] });

  ngOnInit() {
    if (!this.#authService.validToken) {
      this.resetPassToken$ = this.#route.queryParams
        .pipe(
          filter(params => params['token'] !== undefined),
          map(params => params['token']),
          tap(token => this.resetToken = token)
        )
    } else {
      this.#router.navigate(['/home']).then(() => null)
    }
  }

  async login() {
    const body = { email: this.loginForm.value.email, password: this.loginForm.value.password};
    await this.doLogin(body)
  }

  async doLogin(body: Credentials) {
    const response = await this.#fetch.postLogin(body)
    if ((response as SuccessPostLogin).data?.token) {
      this.#authService.completeLogin((response as SuccessPostLogin).data)
    }
  }

  async confirmNewPassword() {
    const response = await this.#fetch.renewPassword({token: this.resetToken, password: this.resetPasswordForm.value.confirmPassword})
    if (!(response as ErrorI).error) { this.#authService.completeLogin((response as SuccessPostLogin).data) }
  }

  async resetPassword() {
    await this.#fetch.resetPassword({ email: this.loginForm.value.email });
  }

  get resetToken(){ return this.#resetToken }
  set resetToken(value: string) { this.#resetToken = value }

  get isAuth(){ return this.#authService.validToken }

  get loginFormPristine() {
    return this.loginForm.pristine
  }

  get resetPasswordFormPristine() {
    return this.resetPasswordForm.pristine
  }
}
