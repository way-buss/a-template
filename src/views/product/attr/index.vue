<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <!-- row: 已有的属性对象 -->
            <template #="{ row, $index }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm :title="`确定删除${row.attrName}?`" @confirm="deleteAttr(row.id)">
                <template #reference>
                    <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row: 当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc:any) => inputArr[$index] = vc"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
//组合式 API 函数 watch
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
//引入获取已有属性与属性值接口
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '../../../api/product/attr'
import type {
  AttrResponseData,
  Attr,
  AttrValue,
} from '../../../api/product/attr/type'
//获取分类的仓库
import useCategoryStore from '../../../store/modules/category'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
//存储已有的属性与属性值
const attrArr = ref<Attr[]>([])
//定义 card 组件内容切换变量
const scene = ref<number>(0) //scene = 0, 显示 table;  scene = 1, 展示添加与修改属性
//收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: '', //新增属性的名字
  attrValueList: [], //新增的属性值数组
  categoryId: '', //三级分类的 ID
  categoryLevel: 3, //代表的是三级分类
})
//存储对应的组件实例 el-input
const inputArr = ref<any>([])
//监听仓库三级分类 ID 变化
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询的属性与属性值
    attrArr.value = []
    //保证三级分类得有数据才能发请求
    if (!categoryStore.c3Id) return
    //获取分类的 ID
    getAttr()
  },
)
//获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  //获取分类下的已有的属性与属性值
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}
//添加属性按钮的回调
const addAttr = () => {
  //每一次点击的时候，先清空一下数据再收集收据
  Object.assign(attrParams, {
    attrName: '', //新增属性的名字
    attrValueList: [], //新增的属性值数组
    categoryId: categoryStore.c3Id, //三级分类的 ID
    categoryLevel: 3, //代表的是三级分类
  })
  //切换为添加与修改属性的结构
  scene.value = 1
  //点击按钮收集新增属性的三级分类的 ID
  //   attrParams.categoryId = categoryStore.c3Id
}
//table表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  //切换为添加与修改属性的结构
  scene.value = 1
  //将已有的属性对象赋值给 attrParams对象
  //ES6 -> Object.assign进行对象合并
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//取消按钮的回调
const cancel = () => {
  scene.value = 0
}
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  })
  //获取最后 el-input 组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
//保存按钮的回调
const save = async () => {
  //发请求
  const result: any = await reqAddOrUpdateAttr(attrParams)
  //添加属性 ｜ 修改已有的属性已经成功
  if (result.code === 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })

    //获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
//属性值表单元素失去焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断1
  if (row.valueName.trim() === '') {
    //删除对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //非法情况判断2
  const repeat = attrParams.attrValueList.find((item) => {
    //把当前失去焦点的属性值对象从数组中去除
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //将重复的属性值从数组中去除
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  //相应的属性值对象 flag 变为 false， 展示div
  row.flag = false
}
//属性值 div 点击事件
const toEdit = (row: AttrValue, $index: number) => {
  //相应的属性值对象 flag 变为 true， 展示input
  row.flag = true
  //nextTick:响应式数据发生变化，获取更新后的dom(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  //发请求删除已有的属性
  const result: any = await reqRemoveAttr(attrId)
  //删除成功 > 提示信息
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //删除成功后获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
     //清空仓库的数据
     categoryStore.$reset()
})
</script>
<style scoped lang="scss"></style>
