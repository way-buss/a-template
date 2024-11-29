export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//定义sku 对象的ts 类型
//sku
export interface Attr {
  attrId: string | number //平台属性 ID
  valueId: string | number //属性值 ID
}
export interface saleArr {
  saleAttrId: string | number //属性 ID
  saleAttrValueId: string | number //属性值 ID
}

export interface SkuData {
  category3Id: string | number //三级分类 ID
  spuId: string | number //已有的 spu ID
  tmId: string | number //spu 品牌 ID
  skuName: string //sku 名字
  price: string | number //sku 价格
  weight: string | number //sku 重量
  skuDesc: string //sku 描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string //sku 图片地址
  isSale?:number //控制商品的上架与下架
  id?:number
}

//获取sku接口返回的数据 ts 类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number,
  }
}

//获取商品详情的接口ts类型
export interface SkuInfoData extends ResponseData{
  data:SkuData[]
}
