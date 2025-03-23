import { DATE_PARTS } from "../enum/enum";

export const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

export function dateTime(param: string | number) {
  const date = String(param).split('/');
  return new Date(Number(date[DATE_PARTS.year]), Number(date[DATE_PARTS.month]) - 1, Number(date[DATE_PARTS.day])).getTime();
}
