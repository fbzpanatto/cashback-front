import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { SuccessGetTxtMessageI, TextMessage } from "../../../interfaces/interfaces";
import { FetchTxtMessageService } from "../../../services/fetch-txt-message.service";

@Component({
  selector: 'app-text-message',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.scss', '../../../styles/input.scss', '../../../styles/form.scss']
})
export class TextMessageComponent implements OnInit {

  #messageId?: number;

  #txtService = inject(FetchTxtMessageService);

  #original?: TextMessage

  #fb = inject(FormBuilder);

  form = this.#fb.group({
    message: ['', {
      validators: [Validators.required]
    }],
  })

  async ngOnInit() {
    const response = await this.#txtService.getMessage()

    if((response as SuccessGetTxtMessageI).data) {

      const { id, text } = (response as SuccessGetTxtMessageI).data

      this.#original = { id, text };
      this.messageId = id;
      this.form.setValue({ message: String(text) })
    }
  }

  async onSubmit() {
    const data = this.form.value

    const body = {
      id: Number(this.messageId),
      text: data.message
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
