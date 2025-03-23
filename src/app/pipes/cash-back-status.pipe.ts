import { Pipe, PipeTransform } from '@angular/core';

const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
enum DATE_PARTS { year = 2, month = 1, day = 0 }

@Pipe({
  name: 'cashBackStatus',
  standalone: true
})
export class CashBackStatusPipe implements PipeTransform {

  transform(withdrawn: Date | string | null | undefined, currentDate: string, expiration: Date | string | null | undefined) {

    if(DATE_REGEX.test(String(withdrawn) ?? '')) {
      return withdrawn as string;
    }

    const expirationDateGetTime = this.getTime(expiration as string)
    const currentDateGetTime = this.getTime(currentDate)

    return expirationDateGetTime < currentDateGetTime ? 'Expirado' : 'Válido'
  }

  getTime(param: string | number){
    const date = String(param).split('/');
    return new Date(Number(date[DATE_PARTS.year]), Number(date[DATE_PARTS.month]) - 1, Number(date[DATE_PARTS.day])).getTime();
  }
}
