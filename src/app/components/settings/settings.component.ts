import {Component, inject, output} from '@angular/core';
import { MatButton } from "@angular/material/button";
import { ToolbarTitleService} from "../../services/toolbar-title.service";
import { CashbackComponent } from "./cashback/cashback.component";
import { ActionComponent } from "./action/action.component";
import { TextMessageComponent } from "./text-message/text-message.component";
import { MatRipple } from "@angular/material/core";
import {TopBarComponent} from "../top-bar/top-bar.component";
import {MarketingComponent} from "./marketing/marketing.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CashbackComponent,
    ActionComponent,
    TextMessageComponent,
    MatButton,
    TopBarComponent,
    MarketingComponent,
    NgClass,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  #toolBar = inject(ToolbarTitleService);

  #selectedOption = 1

  constructor() {
    this.#toolBar.updateTitle(this.title)
    this.#toolBar.updateHome(true)
    this.#toolBar.updateLogout(true)
  }

  setForm(item: { id: number, title: string, selected: boolean }) {
    this.selectedOption = item.id
  }

  get formSelector() {
    return [
      { id: 1, title: 'Cashback', selected: true },
      { id: 2, title: 'Ação', selected: false },
      { id: 3, title: 'Texto', selected: false },
      { id: 4, title: 'Marketing', selected: false },
    ]
  }

  get selectedOption() {
    return this.#selectedOption
  }

  set selectedOption(selected: number) {
    this.#selectedOption = selected
  }

  get title() { return 'Parâmetros' }

}
