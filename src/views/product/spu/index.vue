<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />

    <el-card style="margin: 10px 0">
      <!-- v-if | v-show 都可以实现显示与隐藏 -->
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加SPU
        </el-button>
        <!-- 展示已有的 SPU 数据 -->
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row: 已有的 spu 对象 -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                @click="updateSpu(row)"
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}吗？`" width="200" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加spu ｜修改spu 子组件 -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加sku 子组件 -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene" />
      <!-- dialog对话框：展示已有的sku 数据 -->
      <el-dialog v-model="show" title="sku列表">
        <el-table border :data="skuArr">
          <el-table-column label="sku名字" prop="skuName"></el-table-column>
          <el-table-column label="sku价格" prop="price"></el-table-column>
          <el-table-column label="sku重量" prop="weight"></el-table-column>
          <el-table-column label="sku图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '../../../api/product/spu/type'
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '../../../api/product/spu'
//引入组件
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
//引入分类的仓库
import useCategoryStore from '../../../store/modules/category'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
//预设场景数据
const scene = ref<number>(0) //0:显示已有 spu, 1:添加或者修改已有 spu, 2:添加sku 结构
//分页器默认页码
const pageNo = ref<number>(1)
//每一页展示几条数据
const pageSize = ref<number>(3)
//存储已有的 SPU 数据
const records = ref<Records>([])
//存储已有的总数
const total = ref<number>(0)
//获取子组件实例的spuForm
const spu = ref<any>()
//获取子组件实例的skuForm
const sku = ref<any>()
//存储全部的 sku 数据
const skuArr = ref<SkuData[]>([])
//
const show = ref<boolean>(false)

//监听三级分类 ID 变化
watch(
  () => categoryStore.c3Id,
  () => {
    //务必保证有三级分类 ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

//此方法执行：可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )

  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

//分页器下拉菜单发生变化时触发
const changeSize = () => {
  getHasSpu()
}

//添加新的 spu 按钮的回调
const addSpu = () => {
  //切换为场景 1: 添加与修改 SPU
  scene.value = 1
  //点击添加 spu 按钮，调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
//修改新的 spu 按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景 1: 添加与修改 SPU
  scene.value = 1
  //调用子组件实例方法获取完整已有的 spu 数据
  spu.value.initHasSpuData(row)
}

//子组件 SpuForm 绑定自定义事件: 目前是让子组件通知父组件切换场景为 0
const changeScene = (obj: any) => {
  //子组件点击取消场景变为 0，展示已有的 spu 数据
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}

//添加sku 按钮的回调
const addSku = (row: SpuData) => {
  //点击添加sku 转换为场景2
  scene.value = 2
  //调用子组件的方法初始化添加sku 数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//查看sku 列表数据
const findSku = async (row: SpuData) => {
  const result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    //对话框显示出来
    show.value = true
  }
}

//删除已有的 spu按钮的回调
const deleteSpu = async (row:SpuData) => {
  const result:any = await reqRemoveSpu((row.id as number))
  if(result.code == 200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    //获取剩余 spu 数据
    getHasSpu(records.value.length>1?pageNo.value:pageNo.value-1)
  } else {
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }
}

//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(()=> {
  categoryStore.$reset()
})
</script>
<style scoped lang="scss"></style>
