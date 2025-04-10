import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { FetchMarketingService } from "../../../services/fetch-marketing.service";
import { MarketingMessage, SuccessGetMarketingI, SuccessPutI } from "../../../interfaces/interfaces";
import { DialogService } from "../../../services/dialog.service";
import { environment } from "../../../../environments/environment";
import { firstValueFrom, tap } from "rxjs";

@Component({
  selector: 'app-marketing',
  imports: [ MatButton, MatFormField, MatIcon, MatInput, ReactiveFormsModule, MatIcon, MatIcon, MatButton ],
  templateUrl: './marketing.component.html',
  standalone: true,
  styleUrls: ['../../../styles/input.scss', '../../../styles/form.scss']
})
export class MarketingComponent implements OnInit {

  #marketingId?: number;
  #fetchMarketing = inject(FetchMarketingService);
  #dialog = inject(DialogService);
  #original?: { id: number; message: string | null | undefined }

  #fb = inject(FormBuilder);

  form = this.#fb.group({ message: ['', { validators: [Validators.required] }] })

  async ngOnInit() {

    const marketingMessage = await firstValueFrom(this.#fetchMarketing.getMessage(environment.MMARKETING_MESSAGE_ID))

    if((marketingMessage as SuccessGetMarketingI).data) {
      const { id, message } = (marketingMessage as  SuccessGetMarketingI).data

      this.#original = { id, message };
      this.marketingId = id
      this.form.setValue({message: String(message)})

    }
  }

  async onSubmit() {
    const data = this.form.value

    const body = { id: Number(this.marketingId), message: data.message }

    const preResult = await firstValueFrom(this.#fetchMarketing.putMessage(body as MarketingMessage))

    if((preResult as SuccessPutI).message) {
      const message = (preResult as SuccessPutI).message
      await firstValueFrom(
        this.#dialog.open({ title: 'Alerta', message, actions: false })
          .afterClosed()
          .pipe(tap(() => { this.#original = body; this.form?.markAsPristine()}))
      )
    }
  }

  resetValues() { this.form.markAsPristine(); this.form.setValue({ message: String(this.#original?.message)}) }

  get formIsValid() { return this.form.valid }
  get formIsPristine() { return this.form.pristine }

  get marketingId() { return this.#marketingId }
  set marketingId(marketingId: number | undefined) { this.#marketingId = marketingId }
}
