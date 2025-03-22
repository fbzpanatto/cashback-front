import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID, inject, Injectable, ENVIRONMENT_INITIALIZER } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


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
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: ENVIRONMENT_INITIALIZER, multi: true, useValue: () => inject(Initializers).init() },
  ]
};
