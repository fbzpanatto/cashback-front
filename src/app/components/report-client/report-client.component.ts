import { Component, inject, OnInit } from '@angular/core';
import { CashBackStatusPipe } from "../../pipes/cash-back-status.pipe";
import { CurrencyPipe, SlicePipe } from "@angular/common";
import { TotalCashBacksPipe } from "../../pipes/total-cash-backs.pipe";
import { currentDateFn } from "../../utils/utils";
import { FetchSaleService } from "../../services/fetch-sale.service";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Sale, SuccessGetSaleI } from "../../interfaces/interfaces";
import { ToolbarTitleService } from "../../services/toolbar-title.service";
import { TopBarComponent } from "../top-bar/top-bar.component";

@Component({
  selector: 'app-report-client',
  imports: [
    CashBackStatusPipe,
    CurrencyPipe,
    TotalCashBacksPipe,
    TopBarComponent,
    SlicePipe
  ],
  templateUrl: './report-client.component.html',
  styleUrls: ['../report/report.component.scss', '../../styles/table.scss', '../../styles/input.scss', './report-client.component.scss']
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

    if((response as SuccessGetSaleI).data) {
      this.data = (response as SuccessGetSaleI).data
    }
  }

  get data() { return this.#data }

  set data(data: Sale[] | undefined) { this.#data = data }

  get currentDate() { return currentDateFn() }

  get title() {
    return 'Meus Cashbacks'
  }
}
