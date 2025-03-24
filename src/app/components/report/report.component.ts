import { Component, computed, ElementRef, inject, OnInit, viewChildren } from '@angular/core';
import { FetchService } from "../../services/fetch.service";
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
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { SalesSignalService } from "../../services/sales-signal.service";
import { currentDateFn } from "../../utils/utils";
import { MatIconButton } from "@angular/material/button";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CashBackPipe, ReactiveFormsModule, TotalCashBacksPipe, TotalSellsPipe, CurrencyPipe, MatIcon, CashBackStatusPipe, MatIconButton],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss', '../../styles/table.scss']
})
export class ReportComponent implements OnInit {

  #fetch = inject(FetchService)
  #sales = inject(SalesSignalService)
  #search: FormControl = new FormControl("")

  cashBackStatus = viewChildren<ElementRef<HTMLTableCellElement>>('cashBackStatus')
  searchSignal = toSignal(this.#search.valueChanges.pipe(startWith(""), debounceTime(400), distinctUntilChanged()))

  async ngOnInit() {
    await this.#fetch.get()
  }

  async withdrawnDate(item: Sale) {

    const value = this.cashBackStatus().find(el => String(el.nativeElement.id) === String(item.saleId))?.nativeElement.innerText

    if(item.withdrawnDate === null && value === CashBackStatus.valid) {
      await this.#sales.updateSale(item.saleId, { withdrawnDate: this.currentDate })
      await this.#fetch.put(item.saleId, { withdrawnDate: this.currentDate })
      return
    }
  }

  async reload() {
    await this.#fetch.get()
  }

  clearSearch(): void {
    this.#search.patchValue('')
  }

  get search() {
    return this.#search
  }

  get filtered() {
    return computed(() => this.data().filter(el => {
      return el.clientName.toLowerCase().trim().includes(this.searchSignal()?.toLowerCase().trim()) ||
        el.clientPhone.toLowerCase().trim().includes(this.searchSignal()?.toLowerCase().trim())
    }))
  }

  get data() {
    return this.#sales.data
  }

  get currentDate() {
    return currentDateFn()
  }
}
