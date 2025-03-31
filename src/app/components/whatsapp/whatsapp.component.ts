import { Component, inject, OnInit } from '@angular/core';
import { WebSocketService } from "../../services/web-socket.service";
import { ToolbarTitleService } from "../../services/toolbar-title.service";
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

  #toolBarService = inject(ToolbarTitleService)

  #socket = inject(WebSocketService)

  constructor() {
    this.#toolBarService.updateTitle(this.title)
  }

  async ngOnInit() {

    this.#socket.getQrCode().subscribe(async (qr) => {
      this.qrCode = await QRCode.toDataURL(qr)
    });

    this.#socket.getReadyStatus().subscribe(() => {
      this.isReady = true;
    });
  }

  get title() {
    return 'Whatsapp';
  }
}
