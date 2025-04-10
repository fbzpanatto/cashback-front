import { Pipe, PipeTransform } from '@angular/core';
import { DATE_REGEX, dateTime } from "../utils/utils";

type TypesForDate = Date | string | null | undefined

@Pipe({
  standalone: true,
  name: 'cashBackClientStatus'
})
export class CashBackClientStatusPipe implements PipeTransform {

  transform(withdrawn: TypesForDate, currentDate: string, expiration: TypesForDate) {

    if(DATE_REGEX.test(String(withdrawn) ?? '')) {
      return `Utilizado em: ${ withdrawn as string }`
    }

    const expirationDateGetTime = dateTime(expiration as string)
    const currentDateGetTime = dateTime(currentDate)

    return expirationDateGetTime < currentDateGetTime ? `Expirou em ${ expiration }` : `Expira em: ${ expiration }`
  }

}
