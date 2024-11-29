<template>
     <el-form label-width="100px">
          <el-form-item label="SKU名称">
               <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
          </el-form-item>
          <el-form-item label="价格(元)">
               <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
          </el-form-item>
          <el-form-item label="重量(g)">
               <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
          </el-form-item>
          <el-form-item label="SKU描述">
               <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
          </el-form-item>
          <el-form-item label="平台属性">
               <el-form :inline="true">
                    <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
                         <el-select v-model="item.attrIdAndValueId" style="width: 188px;" >
                              <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id" :label="attrValue.valueName"></el-option>
                         </el-select>
                    </el-form-item>                  
               </el-form>
          </el-form-item>
          <el-form-item label="销售属性">
               <el-form :inline="true">
                    <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
                         <el-select v-model="item.saleIdAndValueId" style="width: 188px;">
                              <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"></el-option>
                         </el-select>
                    </el-form-item>
               </el-form>
          </el-form-item>
          <el-form-item label="图片名称">
               <el-table border :data="imgArr" ref="table">
                    <el-table-column type="selection" align="center" width="120px"></el-table-column>
                    <el-table-column label="图片">
                         <template #="{row, $index}">
                              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px;">
                         </template>
                    </el-table-column>
                    <el-table-column label="名称" prop="imgName"></el-table-column>
                    <el-table-column label="操作">
                         <template #="{row, $index}">
                              <el-button type="primary" size="small" @click="handle(row)">设置默认</el-button>
                         </template>
                    </el-table-column>
               </el-table>
          </el-form-item>
          <el-form-item>
               <el-button type="primary" size="default" @click="save">保存</el-button>
               <el-button type="primary" size="default" @click="cancel">取消</el-button>
          </el-form-item>
     </el-form>
</template>
<script setup lang="ts">
//引入请求 api
import { reqAttr } from '../../../api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '../../../api/product/spu';
import { ref, reactive } from 'vue';
import type { SkuData } from '../../../api/product/spu/type';
import { ElMessage } from 'element-plus';
//平台属性
const attrArr = ref<any>([])
//销售属性
const saleArr = ref<any>([])
//照片墙
const imgArr = ref<any>([])
//收集sku 参数
const skuParams = reactive<SkuData>({
     //父组件传递过来的数据
     category3Id:'',
     spuId:'',
     tmId:'',
     //v-model 收集数据
     skuName:'',
     price:'',
     weight:'',
     skuDesc:'',
     skuAttrValueList:[],
     skuSaleAttrValueList:[],
     skuDefaultImg:''
})

//获取table组件实例
const table = ref<any>()

//取消按钮的回调
const cancel = () => {
     $emit('changeScene', {flag:0, params:''})
}
//当前子组件方法对外暴露
const initSkuData = async(c1Id:number | string, c2Id:number | string, spu:any) => {
     //收集数据
     skuParams.category3Id = spu.category3Id
     skuParams.spuId = spu.id
     skuParams.tmId = spu.tmId
     // console.log(spu.id)
     // console.log(c1Id)
     // console.log(c2Id)
     // console.log(spu.category3Id)
     //获取平台属性
     const result:any = await reqAttr(c1Id, c2Id, spu.category3Id)
     console.log(result)
     //获取对应的销售属性
     const result1:any = await reqSpuHasSaleAttr(spu.id)
     console.log(result1)
     //获取照片墙的数据
     const result2:any = await reqSpuImageList(spu.id)
     console.log(result2)

     //平台属性
     attrArr.value = result.data
     //销售属性
     saleArr.value = result1.data
     //图片
     imgArr.value = result2.data
}

//设置默认图片方法的回调
const handle = (row:any) => {
     //点击的时候，全部的复选框不勾选
     imgArr.value.forEach((item:any) => {
          table.value.toggleRowSelection(item, false)
     });
     //选中的才勾选
     table.value.toggleRowSelection(row, true)
     //收集图片地址
     skuParams.skuDefaultImg = row.imgUrl
}

//保存按钮的方法
const save = async() => {
     //整理参数
     //平台属性
     skuParams.skuAttrValueList = attrArr.value.reduce((prev:any, next:any) => {
          if(next.attrIdAndValueId){
              const [attrId, valueId] = next.attrIdAndValueId.split(':')
              prev.push({
               attrId,
               valueId
              })
          }
          return prev
     },[])
     //销售属性
     skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev:any, next:any) => {
          if(next.saleIdAndValueId){
               const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
               prev.push({
                    saleAttrId,
                    saleAttrValueId
               })
          }
          return prev
     },[])
     //添加sku 的请求
    const result:any = await reqAddSku(skuParams)
    if(result.code == 200){
     ElMessage({
          type:'success',
          message:'添加sku成功'
     })
     //通知父组件切换场景为 0
     $emit('changeScene',{flag:0,params:''})
    }else {
     ElMessage({
          type:'error',
          message:'添加sku失败'
     })
    }
     
}

//对外暴露方法
defineExpose({
     initSkuData
})
//自定义事件方法
const $emit=defineEmits(['changeScene'])
</script>
<style scoped>

</style>