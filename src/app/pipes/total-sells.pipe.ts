import { Pipe, PipeTransform } from '@angular/core';
import { Register } from "../interfaces/interfaces";

@Pipe({
  name: 'totalSells',
  standalone: true
})
export class TotalSellsPipe implements PipeTransform {

  transform(arr?: Register[]) {

    return arr?.reduce((acc, prev) => {

      acc += Number(prev.value);

      return acc
    }, 0)
  }
}
