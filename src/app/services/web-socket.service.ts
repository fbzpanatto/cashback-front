import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket = io('https://cashback-node.up.railway.app/')

  // Escuta o evento "qr" do WebSocket para receber o QR Code
  getQrCode(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('qr', (qr: string) => {
        observer.next(qr); // Envia o QR Code para quem estiver inscrito
      });

      return () => this.socket.disconnect();
    });
  }

  // Escuta o evento "ready" para saber quando o WhatsApp está conectado
  getReadyStatus(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('ready', (message: string) => {
        observer.next(message);
      });

      return () => this.socket.disconnect();
    });
  }
}
