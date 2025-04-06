import { Component, computed, ElementRef, inject, OnInit, viewChildren } from '@angular/core';
import { FetchSaleService } from "../../services/fetch-sale.service";
import { Sale } from "../../interfaces/interfaces";
import { CashBackPipe } from "../../pipes/cash-back.pipe";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { TotalCashBacksPipe } from "../../pipes/total-cash-backs.pipe";
import { TotalSellsPipe } from "../../pipes/total-sells.pipe";
import { CurrencyPipe } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { CashBackStatusPipe } from "../../pipes/cash-back-status.pipe";
import { CashBackStatus } from "../../enum/enum";
import { toSignal } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, firstValueFrom, startWith } from "rxjs";
import { SalesSignalService } from "../../services/sales-signal.service";
import { currentDateFn } from "../../utils/utils";
import { MatIconButton } from "@angular/material/button";
import { ToolbarTitleService } from "../../services/toolbar-title.service";
import { DialogService } from "../../services/dialog.service";
import { TopBarComponent } from "../top-bar/top-bar.component";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CashBackPipe, ReactiveFormsModule, TotalCashBacksPipe, TotalSellsPipe, CurrencyPipe, MatIcon, CashBackStatusPipe, MatIconButton, TopBarComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss', '../../styles/table.scss', '../../styles/input.scss']
})
export class ReportComponent implements OnInit {

  #dialog = inject(DialogService)
  #fetch = inject(FetchSaleService)
  #sales = inject(SalesSignalService)
  #toolBar = inject(ToolbarTitleService)

  #search: FormControl = new FormControl("")

  cashBackStatus = viewChildren<ElementRef<HTMLTableCellElement>>('cashBackStatus')
  searchSignal = toSignal(this.#search.valueChanges.pipe(startWith(""), debounceTime(400), distinctUntilChanged()))

  constructor() {
    this.#toolBar.updateTitle(this.title)
    this.#toolBar.updateHome(true)
    this.#toolBar.updateLogout(true)
  }

  async ngOnInit() { await this.#fetch.get() }

  async setWithdrawnDate(sale: Sale) {

    const value = this.cashBackStatus().find(el => String(el.nativeElement.id) === String(sale.saleId))?.nativeElement.innerText

    if(sale.withdrawnDate === null && value === CashBackStatus.valid) {

      const options = { title: 'Atenção', actions: true, message: `Deseja UTILIZAR o cashback da venda com ID ${ sale.saleId } e data de venda ${ sale.saleDate } do cliente ${ sale.clientName } ?` }
      const source$ = this.#dialog.open(options).afterClosed()
      const result = await firstValueFrom(source$) as boolean | undefined
      if(!result) { return }

      await this.#sales.updateSale(sale.saleId, { withdrawnDate: this.currentDate })
      await this.#fetch.put(sale.saleId, { withdrawnDate: this.currentDate })
      return
    }
  }

  async deleteSale(sale: Sale, cashBackStatus: HTMLTableCellElement) {

    const text = cashBackStatus.innerText != 'Válido' && 'Expirado' ? 'utilizado em': 'com status'
    const options = { title: 'Atenção', actions: true, message: `Deseja DELETAR a venda com ID ${ sale.saleId } para ${ sale.clientName } e cashback ${ text } ${ cashBackStatus.innerText } ?` }
    const source$ = this.#dialog.open(options).afterClosed()

    const result = await firstValueFrom(source$) as boolean | undefined
    if(!result) { return }

    await this.#sales.deleteSale(sale.saleId)
    await this.#fetch.delete(sale.saleId)
  }

  async reload() { await this.#fetch.get() }

  clearSearch(): void { this.#search.patchValue('') }

  get data() { return this.#sales.data }

  get filtered() {
    return computed(() => this.data().filter(el => {
      return el.clientName.toLowerCase().trim().includes(this.searchSignal()?.toLowerCase().trim()) ||
        el.clientPhone.toLowerCase().trim().includes(this.searchSignal()?.toLowerCase().trim())
    }))
  }

  get title() {
    return 'Relatório'
  }

  get search() { return this.#search }

  get currentDate() { return currentDateFn() }
}
