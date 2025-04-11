import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatButton, MatFabButton } from "@angular/material/button";
import { Router } from "@angular/router";
import { FetchSaleService } from "../../services/fetch-sale.service";
import { Sale, SuccessGetParameterI, SuccessPostI } from "../../interfaces/interfaces";
import { MatIcon } from "@angular/material/icon";
import { ToolbarTitleService } from "../../services/toolbar-title.service";
import { FetchParameterService } from "../../services/fetch-parameter.service";
import { TotalSellsPipe } from "../../pipes/total-sells.pipe";
import { TopBarComponent } from "../top-bar/top-bar.component";
import { firstValueFrom } from "rxjs";
import { DialogService } from "../../services/dialog.service";

  @Component({
  selector: 'app-import-data',
  standalone: true,
    imports: [CommonModule, MatButton, MatFabButton, MatIcon, TotalSellsPipe, TopBarComponent],
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss', '../../styles/table.scss']
})
export class ImportDataComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  tableData: Sale[] = [];

  #defaultCashBack?: number | string | null
  #defaultExpiration?: number | string | null

  #parameterFetchService = inject(FetchParameterService);

  #toolBar = inject(ToolbarTitleService)

  #dialog = inject(DialogService);

  #router = inject(Router);
  #fetch = inject(FetchSaleService)

  constructor() {
    this.#toolBar.updateTitle(this.title)
    this.#toolBar.updateHome(true)
    this.#toolBar.updateLogout(true)
  }

  async ngOnInit() {
    const response = await firstValueFrom(this.#parameterFetchService.getParameter())

    if((response as SuccessGetParameterI).data) {
      const { cashback, expiration_day } = (response as SuccessGetParameterI).data
      this.defaultExpiration = expiration_day
      this.defaultCashBack = cashback
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'text/csv') {
        alert('Por favor, selecione um arquivo .csv');
        return;
      }
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
        const el = prev.split(',')
        acc.push({
          saleId: el[0].trim(),
          clientName: el[1].trim(),
          clientPhone: el[2].trim(),
          saleDate: el[3].trim(),
          saleValue: el[4].trim(),
          cashback: Number(this.defaultCashBack),
          defaultExpiration: Number(this.defaultExpiration)
        })
        return acc
      }, [])
  }

  setNewCashBack(row: Sale, cashback: number | string) {
    const element = this.tableData.find(element => element.saleId === row.saleId)
    if(element) { element.cashback = Number(cashback) }
  }

  setNewExpirationDay(row: Sale, defaultExpiration: number | string) {
    const element = this.tableData.find(element => element.saleId === row.saleId)
    if(element) { element.defaultExpiration = Number(defaultExpiration) }
  }

  async importData() {
    const dataToPost = this.formatData(this.tableData)
    const response = await firstValueFrom(this.#fetch.post(dataToPost))

    if((response as SuccessPostI).message) {
      const message = (response as SuccessPostI).message
      this.#dialog.open({ title: 'Alerta', message })
    }

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

  get title() { return 'Importar' }

  get defaultExpiration() { return this.#defaultExpiration }
  set defaultExpiration(value: number | string | null | undefined) { this.#defaultExpiration = value }

  get defaultCashBack() { return this.#defaultCashBack }
  set defaultCashBack(value: number | string | null | undefined) { this.#defaultCashBack = value }
}
