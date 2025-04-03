import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  title?: string
  message?: string
  actions?: boolean
  recuseOptions?: boolean

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogComponent> ) {
    this.title = this.data.title
    this.message = this.data.message
    this.actions = this.data.actions
    this.recuseOptions = this.data.recuseOptions
  }

  close() { this.dialogRef.close()}

}
