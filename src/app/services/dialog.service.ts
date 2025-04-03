import { inject, Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  #dialog = inject(MatDialog)

  open(options: { title: string, message: string, actions?: boolean, recuseOptions?: boolean }) {

    const { title, message, actions, recuseOptions } = options

    return this.#dialog.open(DialogComponent, {
      minWidth: '365px',
      maxWidth: '565px',
      width: '100%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'backdropBackground',
      data: { title, message, actions, recuseOptions },
    })
  }
}
