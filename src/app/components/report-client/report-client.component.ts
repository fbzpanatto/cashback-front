import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from "@angular/common";
import { TotalCashBacksPipe } from "../../pipes/total-cash-backs.pipe";
import { currentDateFn } from "../../utils/utils";
import { FetchSaleService } from "../../services/fetch-sale.service";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Sale, SuccessGetMarketingI, SuccessGetSaleI } from "../../interfaces/interfaces";
import { ToolbarTitleService } from "../../services/toolbar-title.service";
import { TopBarComponent } from "../top-bar/top-bar.component";
import { MatIcon } from "@angular/material/icon";
import { CashBackPipe } from "../../pipes/cash-back.pipe";
import { CashBackClientStatusPipe } from "../../pipes/cash-back-client-status.pipe";
import { FetchMarketingService } from "../../services/fetch-marketing.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-report-client',
  imports: [
    CurrencyPipe,
    TotalCashBacksPipe,
    TopBarComponent,
    MatIcon,
    CashBackPipe,
    CashBackClientStatusPipe
  ],
  templateUrl: './report-client.component.html',
  standalone: true,
  styleUrls: ['../report/report.component.scss', '../../styles/table.scss', '../../styles/input.scss', './report-client.component.scss']
})
export class ReportClientComponent implements OnInit {

  #data?: Sale[]
  #fetch = inject(FetchSaleService)
  #route = inject(ActivatedRoute)
  #toolBar = inject(ToolbarTitleService)
  #marketing = inject(FetchMarketingService)
  #message?: string

  constructor() {
    this.#toolBar.updateTitle(this.title)
    this.#toolBar.updateHome(false)
    this.#toolBar.updateLogout(false)
  }

  async ngOnInit() {

    const source$ = this.#route.params
    const params = await firstValueFrom(source$)

    const response = await firstValueFrom(this.#fetch.getSalesByClient(params['id']))
    const marketingResult = await firstValueFrom(this.#marketing.getMessage(environment.MMARKETING_MESSAGE_ID))

    if((response as SuccessGetSaleI).data) {
      this.data = (response as SuccessGetSaleI).data
    }

    if((marketingResult as SuccessGetMarketingI).data) {
      const { id, message } = (marketingResult as SuccessGetMarketingI).data
      this.message = message
    }
  }

  get data() { return this.#data }

  set data(data: Sale[] | undefined) { this.#data = data }

  get currentDate() { return currentDateFn() }

  get title() {
    return 'Meus Cashbacks'
  }

  get message() { return this.#message }
  set message(value) { this.#message = value }
}
