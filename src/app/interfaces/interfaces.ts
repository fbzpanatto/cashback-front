export interface Sale {
  saleId: number | string,
  clientId?: number,
  clientName: string,
  clientPhone: string
  saleValue: number | string,
  saleDate: Date | string | null,
  cashback?: number,
  cashbackExpiration?: Date | string | null,
  withdrawnDate?: Date | string | null,
  defaultExpiration?: number | null,
}

export interface SuccessGetInterface { status: number, data: Sale[] }
export interface SuccessPostInterface { status: number, message: string }
export interface ErrorInterface { status: number, error: string }
