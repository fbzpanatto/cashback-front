import { Component, inject, OnInit } from '@angular/core';
import { FetchService } from "../../services/fetch.service";
import { firstValueFrom } from "rxjs";
import { WebSocketService } from "../../services/web-socket.service";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-whatsapp',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.scss'
})
export class WhatsappComponent implements OnInit {

  qrCodeUrl: string = '';
  isReady: boolean = false;

  #socket = inject(WebSocketService)
  #fetch = inject(FetchService)

  ngOnInit() {
    // Captura o QR Code do WebSocket
    this.#socket.getQrCode().subscribe(qr => {
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qr}`;
    });

    this.#socket.getReadyStatus().subscribe(() => {
      this.isReady = true;
    });
  }

  async qrCode() {
    const response = await firstValueFrom(await this.#fetch.qrCode<string>())
    if(typeof response != 'string' && response === null) { return }

    console.log('qrCode()', response)

  }
}
