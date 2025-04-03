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

export interface Action {
  id: number,
  day: number,
  active: number,
  createdAt: string,
  updatedAt: string,
}

export interface Parameter {
  id: number,
  cashback: number | string | null | undefined,
  expiration_day: number | string | null | undefined
}

export interface TextMessage {
  id: number,
  text: string | null | undefined,
}

export interface Payload { token: string, expiresIn: number, admin: boolean  }

export interface Credentials { email?: string | null, password?: string | null, token?: string | null }

export interface SuccessGetSaleI { status: number, data: Sale[] }
export interface SuccessGetActionI { status: number, data: Action[] }
export interface SuccessGetParameterI { status: number, data: Parameter }
export interface SuccessGetTxtMessageI { status: number, data: TextMessage }
export interface SuccessPostI { status: number, message: string }
export interface SuccessPostLogin { status: number, data: Payload }
export interface SuccessPutI { status: number, message: string }
export interface SuccessDeleteI { status: number, message: string }
export interface ErrorI { status: number, error: string }
