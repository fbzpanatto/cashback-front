import { Pipe, PipeTransform } from '@angular/core';
import { DATE_REGEX, dateTime } from "../utils/utils";

type TypesForDate = Date | string | null | undefined

@Pipe({
  name: 'cashBackStatus',
  standalone: true
})
export class CashBackStatusPipe implements PipeTransform {

  transform(withdrawn: TypesForDate, currentDate: string, expiration: TypesForDate) {

    if(DATE_REGEX.test(String(withdrawn) ?? '')) {
      return withdrawn as string;
    }

    const expirationDateGetTime = dateTime(expiration as string)
    const currentDateGetTime = dateTime(currentDate)

    return expirationDateGetTime < currentDateGetTime ? 'Expirado' : 'Válido'
  }
}
