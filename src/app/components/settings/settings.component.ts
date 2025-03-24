import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { SettingsFields } from "../../enum/enum";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";

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

  form = this.#fb.group({
    cashbackPercentage: ['', Validators.required],
    expirationDays: ['', Validators.required],
  })

  onSubmit() {
  }

  clearField(name: string) {

  }

  get cashbackPercentageFieldName() {
    return SettingsFields.cashbackPercentage;
  }

  get expirationDaysFieldName() {
    return SettingsFields.expirationDays;
  }
}
