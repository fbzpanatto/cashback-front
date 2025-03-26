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

export interface Parameter {
  id: number,
  cashback: number | string | null | undefined,
  expiration_day: number | string | null | undefined
}

export interface Message {
  phone: string,
  message: string
}

export interface SuccessGetSaleInterface { status: number, data: Sale[] }
export interface SuccessGetParameterInterface { status: number, data: Parameter }
export interface SuccessPostInterface { status: number, message: string }
export interface SuccessPutInterface { status: number, message: string }
export interface ErrorInterface { status: number, error: string }
