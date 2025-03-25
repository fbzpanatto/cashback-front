import { Pipe, PipeTransform } from '@angular/core';
import { Sale } from "../interfaces/interfaces";

@Pipe({
  name: 'totalSells',
  standalone: true
})
export class TotalSellsPipe implements PipeTransform {

  transform(arr?: Sale[]) {

    return arr?.reduce((acc, prev) => {

      acc += Number(prev.saleValue);

      return acc
    }, 0)
  }
}
