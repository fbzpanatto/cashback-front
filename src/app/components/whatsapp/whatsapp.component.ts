import { Component, inject } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { FetchService } from "../../services/fetch.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'app-whatsapp',
  imports: [
    MatButton
  ],
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.scss'
})
export class WhatsappComponent {

  #fetch = inject(FetchService)

  async qrCode() {
    const response = await firstValueFrom(await this.#fetch.qrCode<string>())
    if(typeof response != 'string' && response === null) { return }

    console.log('qrCode()', response)

  }
}
