import { Component, inject, OnInit } from '@angular/core';
import { CashBackPipe } from "../../pipes/cash-back.pipe";
import { CashBackStatusPipe } from "../../pipes/cash-back-status.pipe";
import { CurrencyPipe } from "@angular/common";
import { TotalCashBacksPipe } from "../../pipes/total-cash-backs.pipe";
import { TotalSellsPipe } from "../../pipes/total-sells.pipe";
import { currentDateFn } from "../../utils/utils";
import { FetchSaleService } from "../../services/fetch-sale.service";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Sale } from "../../interfaces/interfaces";
import { ToolbarTitleService } from "../../services/toolbar-title.service";

@Component({
  selector: 'app-report-client',
  imports: [
    CashBackPipe,
    CashBackStatusPipe,
    CurrencyPipe,
    TotalCashBacksPipe,
    TotalSellsPipe
  ],
  templateUrl: './report-client.component.html',
  styleUrls: ['../report/report.component.scss', '../../styles/table.scss', '../../styles/input.scss']
})
export class ReportClientComponent implements OnInit {

  #data?: Sale[]
  #fetch = inject(FetchSaleService)
  #route = inject(ActivatedRoute)
  #toolBar = inject(ToolbarTitleService)

  constructor() {
    this.#toolBar.updateTitle(this.title)
    this.#toolBar.updateHome(false)
    this.#toolBar.updateLogout(false)
  }

  async ngOnInit() {

    const source$ = this.#route.params
    const params = await firstValueFrom(source$)

    const response = await this.#fetch.getSalesByClient(params['id'])
    this.data = response as Sale[]
  }

  get data() { return this.#data }

  set data(data: Sale[] | undefined) { this.#data = data }

  get currentDate() { return currentDateFn() }

  get title() {
    return 'Cashbacks'
  }
}
