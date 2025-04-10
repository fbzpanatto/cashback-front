import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { Action, SuccessGetActionI, SuccessGetTxtMessageI, TextMessage } from "../../../interfaces/interfaces";
import { FetchTxtMessageService } from "../../../services/fetch-txt-message.service";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { FetchActionService } from "../../../services/fetch-action.service";

@Component({
  selector: 'app-text-message',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    ReactiveFormsModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './text-message.component.html',
  styleUrls: ['../../../styles/input.scss', '../../../styles/form.scss', './text-message.component.scss']
})
export class TextMessageComponent implements OnInit {

  #messageId?: number;

  #fetchAction = inject(FetchActionService)
  #txtService = inject(FetchTxtMessageService);

  #original?: TextMessage

  currentDay?: Action

  days: Action[] = []

  isMenuOpen = false

  #fb = inject(FormBuilder);

  form = this.#fb.group({
    message: ['', {
      validators: [Validators.required]
    }],
  })

  async ngOnInit() {

    const actionsResponse = await this.#fetchAction.getActions()

    if((actionsResponse as SuccessGetActionI).data) {
      const preResult = (actionsResponse as SuccessGetActionI).data
      this.days = preResult.filter(el => el.active)
      this.currentDay = this.days[0]
      await this.getMessage(this.currentDay?.day)
    }
  }

  async getMessage(actionDay: number) {
    const response = await this.#txtService.getMessage(actionDay)

    if((response as SuccessGetTxtMessageI).data) {

      const { id, text } = (response as SuccessGetTxtMessageI).data

      this.#original = { id, text };
      this.messageId = id;
      this.form.setValue({ message: String(text) })
    }
  }

  async setYear(day: Action) {
    this.currentDay = day
    await this.getMessage(this.currentDay.day)
  }

  async onSubmit() {
    const data = this.form.value

    const body = {
      id: Number(this.messageId),
      text: data.message,
      actionId: this.currentDay?.id
    }

    await this.#txtService.putMessage(body)

    this.#original = body
    this.form?.markAsPristine()
  }

  resetValues() {
    this.form.markAsPristine()
    this.form.setValue({
      message: String(this.#original?.text)
    })
  }

  get formIsValid() { return this.form.valid }

  get formIsPristine() { return this.form.pristine }

  get messageId() { return this.#messageId }
  set messageId(messageId: number | undefined) { this.#messageId = messageId }

}
