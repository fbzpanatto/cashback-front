import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID, inject, Injectable, provideEnvironmentInitializer } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { io, Socket } from "socket.io-client";
import { environment } from "../environments/environment";
import { WebSocketService } from "./services/web-socket.service";
import { loggingInterceptor } from "./interceptors/auth.interceptor";


registerLocaleData(localePt, 'pt-BR');
registerLocaleData(localePt, 'pt-BR', localePtExtra)

@Injectable({
  providedIn: 'root'
})
class Initializers {

  constructor( private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer ) {}

  get icons() {
    return [
      'account_circle',
      'add',
      'accessible',
      'assessment',
      'assignment_add',
      'backspace',
      'bar',
      'block',
      'calendar_month',
      'calendar_today',
      'cancel',
      'check',
      'colors',
      'chevron_left',
      'close',
      'delete',
      'edit',
      'email',
      'exit_to_app',
      'group',
      'groups',
      'home',
      'info',
      'sync',
      'list',
      'login',
      'menu',
      'move_up',
      'person',
      'post_add',
      'report',
      'save',
      'questions',
      'school',
      'search',
      'spellcheck',
      'today',
      'undo',
      'visibility',
      'visibility_off',
      'path1',
      'path2'
    ]
  }

  init() {
    for (let icon of this.icons) {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/mat-icons/${icon}.svg`)
      )
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideEnvironmentInitializer(() => { inject(Initializers).init() }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: Socket,
      useFactory: () => io(environment.API_URL),
    },
    WebSocketService,
  ]
};
