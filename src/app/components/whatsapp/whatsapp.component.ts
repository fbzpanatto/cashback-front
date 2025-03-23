import { Component, inject, OnInit } from '@angular/core';
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

  async ngOnInit() {

    this.#socket.getQrCode().subscribe(async (qr) => {
      this.qrCode = await QRCode.toDataURL(qr)
    });

    this.#socket.getReadyStatus().subscribe(() => {
      this.isReady = true;
    });
  }
}
