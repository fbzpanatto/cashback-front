import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatButton, MatFabButton } from "@angular/material/button";
import { Router } from "@angular/router";
import { FetchService } from "../../services/fetch.service";
import { Sale } from "../../interfaces/interfaces";
import { MatIcon } from "@angular/material/icon";
import {ToolbarTitleService} from "../../services/toolbar-title.service";

  @Component({
  selector: 'app-import-data',
  standalone: true,
  imports: [CommonModule, MatButton, MatFabButton, MatIcon],
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss', '../../styles/table.scss']
})
export class ImportDataComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  tableData: Sale[] = [];

  #defaultCashBack?: number
  #defaultExpiration?: number

  #toolBarService = inject(ToolbarTitleService)

  #router = inject(Router);
  #fetch = inject(FetchService)

  constructor() {
    this.#toolBarService.updateTitle(this.title)
  }

  ngOnInit(): void {
    this.defaultCashBack = this.#defaultCashBack ?? 0.05
    this.defaultExpiration = this.#defaultExpiration ?? 60
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result as string;
      this.processFileContent(content);
    };
    reader.readAsText(file);
  }

  processFileContent(content: string) {
    this.tableData = content
      .split('\n')
      .filter(row => row.trim() !== '')
      .reduce((acc: Sale[], prev) => {
        const el = prev.split(';')
        acc.push({
          saleId: el[0].trim(),
          clientName: el[1].trim(),
          clientPhone: el[2].trim(),
          saleDate: el[3].trim(),
          saleValue: el[4].trim(),
          cashback: this.defaultCashBack,
          defaultExpiration: this.defaultExpiration
        })
        return acc
      }, [])
  }

  async importData() {
    const dataToPost = this.formatData(this.tableData)
    await this.#fetch.post(dataToPost)
    await this.#router.navigate(['/home'])
  }

  formatData(data: Sale[]) {
    return this.setExpirationDate(data)
  }

  setExpirationDate(data: Sale[]) {
    return data.map(item => {
      const dateParts = (item.saleDate as string).split('/'); // Assuming format is "DD/MM/YYYY"
      const fullDate = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);

      if (item.defaultExpiration) {
        fullDate.setDate(fullDate.getDate() + Number(item.defaultExpiration)); // Add expiration days
      }

      const cashbackExpiration = `${fullDate.getDate().toString().padStart(2, '0')}/${(fullDate.getMonth() + 1).toString().padStart(2, '0')}/${fullDate.getFullYear()}`;

      return { ...item, cashbackExpiration };
    });
  }

  get title() {
    return 'Importar'
  }

  get defaultExpiration() { return this.#defaultExpiration }
  set defaultExpiration(value: number | undefined) { this.#defaultExpiration = value }

  get defaultCashBack() { return this.#defaultCashBack }
  set defaultCashBack(value: number | undefined) { this.#defaultCashBack = value }
}
