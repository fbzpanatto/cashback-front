import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { ToolbarTitleService} from "../../services/toolbar-title.service";
import { decimalValidator, isNumber } from "../../validators/validators";
import { FetchParameterService } from "../../services/fetch-parameter.service";
import { windowFn } from "../../utils/utils";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss', '../../styles/input.scss']
})
export class SettingsComponent implements OnInit {

  #parameterId?: number;
  #fb = inject(FormBuilder);
  #toolBarService = inject(ToolbarTitleService);
  #parameterFetchService = inject(FetchParameterService);

  form = this.#fb.group({
    cashbackPercentage: ['', {
      validators: [Validators.required, isNumber(), decimalValidator()]
    }],
    expirationDays: ['', {
      validators: [Validators.required, Validators.maxLength(3), isNumber()],
    }],
  })

  constructor() {
    this.#toolBarService.updateTitle(this.title)
  }

  async ngOnInit() {
    const data = await this.#parameterFetchService.getParameter()
    if(data) {
      this.parameterId = data.id;
      this.form.setValue({
        cashbackPercentage: String(data.cashback),
        expirationDays: String(data.expiration_day)
      })
    }
  }

  async onSubmit() {
    const data = this.form.value
    await this.#parameterFetchService.putParameter({
      id: this.parameterId as number,
      cashback: data.cashbackPercentage ,
      expiration_day: data.expirationDays
    })
    windowFn().location.reload()
  }

  get title() { return 'Parâmetros' }

  get formIsValid() { return this.form.valid }

  get parameterId() {
    return this.#parameterId
  }

  set parameterId(parameterId: number | undefined) {
    this.#parameterId = parameterId
  }
}
