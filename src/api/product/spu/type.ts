//服务器全部接口返回的数据类型
export interface ResponseData {
     code:number,
     message:string,
     ok:boolean
}

//SPU数据的 ts 类型
export interface SpuData {
     id?:number,
     spuName:string,
     description:string,
     category3Id:string | number,
     tmId:number | string,
     spuSaleAttrList:null | SaleAttr[],
     spuImageList:null | SpuImg[]
}

//数组：元素都是已有SPU数据类型
export type Records = SpuData[]

//定义获取已有的 SPU 接口返回的数据 ts 类型
export interface HasSpuResponseData extends ResponseData {
     data:{
          records: Records,
          total: number,
          size: number,
          current: number,
          searchCount: boolean,
          pages: number
     }
}

//品牌数据的 ts 类型
export interface Trademark {
     id:number,
     tmName:string,
     logoUrl:string
}
//品牌接口返回的数据 ts 类型
export interface AllTradeMark extends ResponseData {
     data:Trademark[]
}

//商品图片的 ts 类型
export interface SpuImg {
     id?:number,
     createTime?:string,
     updateTime?:string,
     spuId?:number,
     imgName?:string,
     imgUrl?:string,
     name?:string,
     url?:string
}
//已有的spu照片墙数据的类型
export interface SpuHasImg extends ResponseData {
     data:SpuImg[]
}

//已有的销售属性值对象 ts 类型
export interface SaleAttrValue {
     id?:number,
     createTime?:null,
     updateTime?:null,
     spuId?:number,
     baseSaleAttrId:number | string,
     saleAttrValueName:string,
     saleAttrName?:string,
     isChecked?:null
}
//存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
//销售属性对象 ts 类型
export interface SaleAttr {
     id?:number,
     createTime?:null,
     updateTime?:null,
     baseSaleAttrId:number | string,
     saleAttrName:string,
     spuId?:number,
     spuSaleAttrValueList:SpuSaleAttrValueList,
     flag?:boolean,
     saleAttrValue?:string
}
//spu已有的销售属性接口返回的 ts 数据类型
export interface SaleAttrResponseData extends ResponseData {
     data:SaleAttr[]
}


//已有的全部spu返回数据的 ts 类型
export interface HasSaleAttr {
     id:number,
     name:string
}
export interface HasSaleAttrResponseData extends ResponseData {
     data: HasSaleAttr[]
}


//sku
export interface Attr {
     attrId:string | number, //平台属性 ID
     valueId:string | number, //属性值 ID
}
export interface saleArr {
     saleAttrId:string | number, //属性 ID
     saleAttrValueId:string | number, //属性值 ID
}

export interface SkuData {
     category3Id:string | number, //三级分类 ID
     spuId:string | number, //已有的 spu ID
     tmId:string | number, //spu 品牌 ID
     skuName:string, //sku 名字
     price:string | number, //sku 价格
     weight:string | number, //sku 重量
     skuDesc:string, //sku 描述
     skuAttrValueList?:Attr[],
     skuSaleAttrValueList?:saleArr[],
     skuDefaultImg:string, //sku 图片地址
}

//获取sku数据接口的 ts 类型
export interface SkuInfoData extends ResponseData {
     data:SkuData[]
}