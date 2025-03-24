import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { SettingsFields } from "../../enum/enum";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import {ToolbarTitleService} from "../../services/toolbar-title.service";

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
export class SettingsComponent {

  #fb = inject(FormBuilder);

  #toolBarService = inject(ToolbarTitleService)

  form = this.#fb.group({
    cashbackPercentage: ['', Validators.required],
    expirationDays: ['', Validators.required],
  })

  constructor() {
    this.#toolBarService.updateTitle(this.title)
  }

  onSubmit() {
  }

  clearField(name: string) {

  }

  get title() {
    return 'Parâmetros'
  }

  get cashbackPercentageFieldName() {
    return SettingsFields.cashbackPercentage;
  }

  get expirationDaysFieldName() {
    return SettingsFields.expirationDays;
  }
}
