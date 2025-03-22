import { Component, inject, OnInit } from '@angular/core';
import { FetchService } from "../../services/fetch.service";
import { firstValueFrom } from "rxjs";
import { WebSocketService } from "../../services/web-socket.service";
import QRCode from "qrcode";

@Component({
  selector: 'app-whatsapp',
  imports: [],
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.scss'
})
export class WhatsappComponent implements OnInit {

  qrCode?: string
  isReady: boolean = false;

  #socket = inject(WebSocketService)
  #fetch = inject(FetchService)

  async ngOnInit() {

    this.#socket.getQrCode().subscribe(async (qr) => {
      this.qrCode = await QRCode.toDataURL(qr)
    });

    this.#socket.getReadyStatus().subscribe(() => {
      this.isReady = true;
    });
  }

  async qrCodeFn() {
    const response = await firstValueFrom(await this.#fetch.qrCode<string>())
    if(typeof response != 'string' && response === null) { return }

    console.log('qrCode()', response)

  }
}
