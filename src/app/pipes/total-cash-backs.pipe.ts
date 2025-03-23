import { Pipe, PipeTransform } from '@angular/core';
import { Sale } from "../interfaces/interfaces";
import { CashBackPipe } from "./cash-back.pipe";
import { CashBackStatusPipe } from "./cash-back-status.pipe";
import { CashBackStatus } from "../enum/enum";

@Pipe({
  name: 'totalCashBacks',
  standalone: true
})
export class TotalCashBacksPipe implements PipeTransform {

  transform(arr: Sale[] | undefined) {

    const cashBackStatusPipe = new CashBackStatusPipe()

    const total = new CashBackPipe()

    return arr?.reduce((acc, prev) => {

      const condition = cashBackStatusPipe.transform(prev.withdrawnDate, this.currentDate, prev.cashbackExpiration)

      if(condition === CashBackStatus.expired) { return acc }

      else if(prev.withdrawnDate) { return acc }

      else { return acc + Number(total.transform(prev.saleValue, prev.cashback)) }
    }, 0)
  }

  get currentDate() {

    const newDate = new Date()
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    return `${day}/${month}/${year}`
  }
}
