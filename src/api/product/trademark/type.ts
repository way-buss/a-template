export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//已有的品牌的 ts 数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

//包含全部品牌数据的 ts 类型
export type Records = TradeMark[]

//获取的已有全部品牌的数据 ts 类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
