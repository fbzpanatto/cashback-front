import {Component, inject} from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {ToolbarTitleService} from "../../services/toolbar-title.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  #toolBarService = inject(ToolbarTitleService)

  constructor() {
    this.#toolBarService.updateTitle(this.title)
  }

  get title() {
    return 'Início'
  }


  get menu() {
    return [
      {
        id: 1,
        title: 'Importar Dados',
        backgroundColor: 'transparent',
        icon: 'icon',
        style: { backgroundColor: '#0a6bc4', color: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
        link: '/import-data'
      },
      {
        id: 2,
        title: 'Relatórios',
        backgroundColor: 'transparent',
        icon: 'icon',
        style: { backgroundColor: '#dcae18', color: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'},
        link: '/report'
      },
      {
        id: 3,
        title: 'Whatsapp',
        backgroundColor: 'transparent',
        icon: 'icon',
        style: { backgroundColor: '#37c53a', color: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'},
        link: '/whatsapp'
      },
      {
        id: 4,
        title: 'Parâmetros',
        backgroundColor: 'transparent',
        icon: 'icon',
        style: { backgroundColor: '#a6a6a6', color: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
        link: '/settings'
      }
    ]
  }
}
