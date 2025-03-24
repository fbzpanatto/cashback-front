import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { ToolbarTitleService} from "../../services/toolbar-title.service";
import { decimalValidator, isNumber } from "../../validators/validators";
import { FetchParameterService } from "../../services/fetch-parameter.service";

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

  #fb = inject(FormBuilder);
  #parameterFetchService = inject(FetchParameterService);
  #toolBarService = inject(ToolbarTitleService)

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
      this.form.setValue({
        cashbackPercentage: String(data.cashback),
        expirationDays: String(data.expiration_day)
      })
    }
  }

  onSubmit() {
  }

  get title() { return 'Parâmetros' }

  get formIsValid() { return this.form.valid }
}
