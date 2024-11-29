<template>
  <el-form label-width="100">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 300px" v-model="spuParams.tmId">
        <el-option
          v-for="(item, index) in AllSpuTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU描述"
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- v-model:file-list 展示默认图片 
      action:上传图片的接口地址
      list-type:文件列表的类型
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        style="width: 300px"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加销售属性
      </el-button>
      <!-- table 展示销售属性与属性值-->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column
          label="属性名"
          width="120"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row, $index }">
            <el-tag
              style="margin: 0 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请你输入属性值"
              size="small"
              style="width: 120px; margin: 0 5px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SpuData } from '../../../api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '../../../api/product/spu'
import type {
  SaleAttrValue,
  HasSaleAttr,
  SaleAttr,
  SpuImg,
  Trademark,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from '../../../api/product/spu/type'
import { ElMessage } from 'element-plus'
const $emit = defineEmits(['changeScene'])
//点击取消按钮:通知父组件切换场景为 0，展示已有的 SPU 数据
const cancel = () => {
  $emit('changeScene', {flag:0, params:'update'})
}
//存储已有的spu数据 -> 商品图片 -> 已有的spu 销售属性 -> 全部销售属性
const AllSpuTradeMark = ref<Trademark[]>([])
const imgList = ref<SpuImg[]>([])
const saleAttr = ref<SaleAttr[]>([])
const allSaleAttr = ref<HasSaleAttr[]>([])
//存储已有的spu对象
const spuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的 ID
  spuName: '', //spu 名字
  description: '', //spu 描述
  tmId: '', //品牌 id
  spuImageList: [],
  spuSaleAttrList: [],
})
//控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
//存储预览图片地址
const dialogImageUrl = ref<string>('')
//将来收集还未选择的销售属性的 ID 与属性值的名字
const saleAttrIdAndValueName = ref<string>('')
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的spu对象,将来在模版中展示
  spuParams.value = spu
  //spu：父组件传递过来的已有的 spu 对象[不完整]
  //获取全部品牌的数据
  const result: AllTradeMark = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖商品的图片
  const result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取已有的 spu 销售属性的数据
  const result2: SaleAttrResponseData = await reqSpuHasSaleAttr(
    spu.id as number,
  )
  //获取整个项目全部的 spu 的销售属性
  const result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  //存储全部品牌的数据
  AllSpuTradeMark.value = result.data
  //spu对应商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  //存储已有的spu 销售属性
  saleAttr.value = result2.data
  //存储全部的销售属性
  allSaleAttr.value = result3.data
}

//照片墙点击预览按钮会触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  //对话框弹出来
  dialogVisible.value = true
}
//照片墙删除文件钩子
const handleRemove = () => {}
//照片上传成功之前的钩子约束文件的大小与类型
const handleUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '文件须大于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '文件须为png|jpeg|gif',
    })
    return false
  }
}

//计算出当前 spu 还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  //全部销售属性：颜色、版本、尺码
  //已有的销售属性：颜色、版本
  const unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加销售属性的方法
const addSaleAttr = () => {
  /*
     baseSaleAttrId:number,
     saleAttrName:string,
     spuSaleAttrValueList:SpuSaleAttrValueList,
     */
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象:将来传给服务器即可
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  //追加到数组中
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAttrIdAndValueName.value = ''
}

//属性值按钮事件
const toEdit = (row: SaleAttr) => {
  //点击按钮，切换input编辑框
  row.flag = true
  row.saleAttrValue = ''
}

//表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
  //整理收集的属性 id 和属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  //整理成服务器需要的属性值形式
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  //非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //判断属性值是否在数组中存在
  const repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换为查看模式
  row.flag = false
}

//保存按钮的回调
const save = async () => {
  //发送请求: 添加spu || 修改已有的spu
  //照片墙的数据
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, //图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  //整理销售属性的数据
  spuParams.value.spuSaleAttrList = saleAttr.value
  const result = await reqAddOrUpdateSpu(spuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })
    //通知父组件切换场景为 0
    $emit('changeScene', {flag:0, params:spuParams.value.id?'update':'add'})
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

//添加一个新的 spu 初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(spuParams.value, {
    category3Id: '', //收集三级分类的 ID
    spuName: '', //spu 名字
    description: '', //spu 描述
    tmId: '', //品牌 id
    spuImageList: [],
    spuSaleAttrList: [],
  })
  //清空照片
  imgList.value = []
  //清空销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  
  //存储三级分类的 id
  spuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  const result: AllTradeMark = await reqAllTradeMark()
  const result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储数据
  AllSpuTradeMark.value = result.data
  allSaleAttr.value = result1.data
}

//对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>
<style scoped></style>
