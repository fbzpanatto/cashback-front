import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule} from "@angular/material/icon";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, map, Observable, tap } from "rxjs";
import { confirmPassValidation, passwordStrengthValidator } from "../../utils/validators";
import { Credentials } from "../../interfaces/interfaces";
import { FetchLoginService } from "../../services/fetch-login.service";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-login',
  imports: [ CommonModule, MatCardModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatIconModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

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
    const body: { email: string; password: string } = { email: this.loginForm.value.email as string, password: this.loginForm.value.password as string };
    await this.doLogin(body);
  }

  async doLogin(body: Credentials) {
    const source = await this.#fetch.saveData(body)
  }

  async confirmNewPassword() {
    const source = this.#fetch.saveData({ token: this.resetToken, password: this.resetPasswordForm.value.confirmPassword })
  }

  async resetPassword() {
    const resource = this.#fetch.saveData({ email: this.loginForm.value.email });
  }

  get resetToken(){ return this.#resetToken }
  set resetToken(value: string) { this.#resetToken = value }

  get isAuth(){ return this.#authService.validToken }

  get lStorageW() { return localStorage }
}
