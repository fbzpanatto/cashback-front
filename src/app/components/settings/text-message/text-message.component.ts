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
  styleUrls: ['./text-message.component.scss', '../../../styles/input.scss', '../../../styles/form.scss']
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
      this.days = ((actionsResponse as SuccessGetActionI).data).filter(el => el.active)
      this.currentDay = this.days.find(el => el.active)
      await this.getMessage(this.currentDay?.day)
    }
  }

  async getMessage(actionDay: number = 1) {
    const response = await this.#txtService.getMessage(actionDay)

    this.form.reset()

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
      actionId: this.currentDay?.day
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
