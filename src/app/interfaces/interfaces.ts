export interface Register {
  id: string,
  name:string,
  tel: string,
  date: string,
  value: string,
  cashback?: number,
  expiration?: number | string,
  withdrawnDate?: number | string,
}

export interface ErrorInterface { status: number, errorMessage: string }
