import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cashBack',
  standalone: true
})
export class CashBackPipe implements PipeTransform {

  transform(value: number | string, cashBack: number | undefined) {
    return (Number(value) * (cashBack ?? 0.05))
  }
}
