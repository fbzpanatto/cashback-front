import { DATE_PARTS } from "../enum/enum";

export const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

export function dateTime(param: string | number) {
  const date = String(param).split('/');
  return new Date(Number(date[DATE_PARTS.year]), Number(date[DATE_PARTS.month]) - 1, Number(date[DATE_PARTS.day])).getTime();
}

export function currentDateFn() {

  const newDate = new Date()
  const day = newDate.getDate().toString().padStart(2, '0');
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const year = newDate.getFullYear();

  return `${day}/${month}/${year}`
}

export function windowFn() {
  return window;
}
