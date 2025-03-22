import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  #socket = inject(Socket)

  // Escuta o evento "qr" do WebSocket para receber o QR Code
  getQrCode(): Observable<string> {
    return new Observable(observer => {
      this.#socket.on('qr', (qr: string) => {
        observer.next(qr);
      });

      return () => this.#socket.off('qr'); // Remove o listener ao destruir a conexão
    });
  }

  // Escuta o evento "ready" para saber quando o WhatsApp está conectado
  getReadyStatus(): Observable<string> {
    return new Observable(observer => {
      this.#socket.on('ready', (message: string) => {
        observer.next(message);
      });

      return () => this.#socket.off('ready');
    });
  }
}
