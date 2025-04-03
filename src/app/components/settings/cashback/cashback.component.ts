import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { decimalValidator, isNumber } from "../../../utils/validators";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { FetchParameterService } from "../../../services/fetch-parameter.service";
import { Parameter } from "../../../interfaces/interfaces";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-cashback',
  imports: [
    FormsModule,
    MatFormField,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatLabel,
    MatInput,
  ],
  templateUrl: './cashback.component.html',
  styleUrls: ['./cashback.component.scss', '../../../styles/input.scss', '../../../styles/form.scss'],
})
export class CashbackComponent implements OnInit {

  #parameterId?: number;
  #parameterFetchService = inject(FetchParameterService);

  #original?: Parameter

  #fb = inject(FormBuilder);

  form = this.#fb.group({
    cashbackPercentage: ['', {
      validators: [Validators.required, isNumber(), decimalValidator()]
    }],
    expirationDays: ['', {
      validators: [Validators.required, Validators.maxLength(3), isNumber()],
    }],
  })

  async ngOnInit() {
    const data = await this.#parameterFetchService.getParameter()

    if(data) {
      this.#original = data
      this.parameterId = data.id;
      this.form.setValue({
        cashbackPercentage: String(data.cashback),
        expirationDays: String(data.expiration_day)
      })
    }
  }

  async onSubmit() {
    const data = this.form.value

    const body = {
      id: this.parameterId as number,
      cashback: data.cashbackPercentage ,
      expiration_day: data.expirationDays
    }

    await this.#parameterFetchService.putParameter(body)
    this.#original = body
    this.form?.markAsPristine()
  }

  resetValues() {
    this.form.markAsPristine()
    this.form.setValue({
      cashbackPercentage: String(this.#original?.cashback),
      expirationDays: String(this.#original?.expiration_day)
    })
  }

  get formIsValid() { return this.form.valid }

  get formIsPristine() { return this.form.pristine }

  get parameterId() { return this.#parameterId }

  set parameterId(parameterId: number | undefined) { this.#parameterId = parameterId }
}
