import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { ToolbarTitleService } from "../../services/toolbar-title.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon, MatIconButton],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

  #toolBar = inject(ToolbarTitleService)
  #auth = inject(AuthService);

  logoutFn() {
    this.#auth.logout(true);
  }

  get toolBarTitle() { return this.#toolBar.title }

  get home() { return this.#toolBar.home }

  get logout() { return this.#toolBar.logout }

}
