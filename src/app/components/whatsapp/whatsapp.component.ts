import { Component, inject, OnInit } from '@angular/core';
import { WebSocketService } from "../../services/web-socket.service";
import { ToolbarTitleService } from "../../services/toolbar-title.service";
import QRCode from "qrcode";
import {TopBarComponent} from "../top-bar/top-bar.component";

@Component({
  selector: 'app-whatsapp',
  imports: [
    TopBarComponent
  ],
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.scss'
})
export class WhatsappComponent implements OnInit {

  qrCode?: string
  isReady: boolean = false;

  #toolBar = inject(ToolbarTitleService)

  #socket = inject(WebSocketService)

  constructor() {
    this.#toolBar.updateTitle(this.title)
    this.#toolBar.updateHome(true)
    this.#toolBar.updateLogout(true)
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
