import { Component, computed, ElementRef, inject, viewChildren } from '@angular/core';
import { FetchService } from "../../services/fetch.service";
import { Register } from "../../interfaces/interfaces";
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

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CashBackPipe, ReactiveFormsModule, TotalCashBacksPipe, TotalSellsPipe, CurrencyPipe, MatIcon, CashBackStatusPipe],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss', '../../styles/table.scss']
})
export class ReportComponent {

  #fetch = inject(FetchService)
  #search: FormControl = new FormControl("")

  searchSignal = toSignal(this.#search.valueChanges.pipe(startWith(""), debounceTime(400), distinctUntilChanged()))
  cashBackStatus = viewChildren<ElementRef<HTMLTableCellElement>>('cashBackStatus')

  async withdrawnDate(item: Register) {

    const value = this.cashBackStatus().find(el => el.nativeElement.id === item.id)?.nativeElement.innerText

    // TODO: Save on database
    if(item.withdrawnDate === undefined && value === CashBackStatus.valid) {
      await this.#fetch.update(item.id, { withdrawnDate: this.currentDate })
      return
    }
  }

  clearSearch(): void {
    this.#search.patchValue('')
  }

  get currentDate() {

    const newDate = new Date()
    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const year = newDate.getFullYear();

    return `${day}/${month}/${year}`
  }

  get search() {
    return this.#search
  }

  get filtered() {
    return computed(() => this.data().filter(el => {
      return el.name.toLowerCase().trim().includes(this.searchSignal()?.toLowerCase().trim()) ||
        el.tel.toLowerCase().trim().includes(this.searchSignal()?.toLowerCase().trim())
    }))
  }

  get data() {
    return this.#fetch.data
  }
}
