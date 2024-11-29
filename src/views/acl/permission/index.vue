<template>
  <div>
    <el-table
      :data="PermissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="权限值"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <!-- row:已有菜单对象｜按钮对象的数据 -->
        <template #="{ row, $index }">
          <el-button
            @click="addPermission(row)"
            type="primary"
            size="small"
            :disabled="row.level == 4 ? true : false"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            @click="updatePermission(row)"
            type="primary"
            size="small"
            :disabled="row.level == 1 ? true : false"
          >
            编辑
          </el-button>
          <el-popconfirm :title="`你确定要删除${row.name}?`" @confirm="removeMenu(row.id)">
            <template #reference>
              <el-button
                type="primary"
                size="small"
                :disabled="row.level == 1 ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog 对话框：用于添加或者更新已有的菜单的数据结构 -->
    <el-dialog
      v-model="dialogVisible"
      :title="menuData.id ? '更新菜单' : '添加菜单'"
    >
      <!-- 表单组件：收集新增与已有的菜单的数据 -->
      <el-form>
        <el-form-item label="名称">
          <el-input
            placeholder="请你输入菜单名称"
            v-model="menuData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input
            placeholder="请你输入权限数值"
            v-model="menuData.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
//引入获取菜单请求 api
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '../../../api/acl/menu'
//引入ts 类型
import type {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from '../../../api/acl/menu/type'
import { ElMessage } from 'element-plus'
//存储菜单的数据
const PermissionArr = ref<PermissionList>([])
//控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
//携带的参数
const menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
//组件挂载完毕
onMounted(() => {
  getHasPermission()
})
//获取菜单数据的方法
const getHasPermission = async () => {
  const result: PermissionResponseData = await reqAllPermission()
  if (result.code == 200) {
    PermissionArr.value = result.data
  }
}
//添加菜单按钮的回调
const addPermission = (row: Permission) => {
  //清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  //显示对话框
  dialogVisible.value = true
  //收集新增的菜单的 level 数值
  menuData.level = row.level + 1
  //给谁新增子菜单
  menuData.pid = row.id as number
}
//编辑按钮的回调
const updatePermission = (row: Permission) => {
  //显示对话框
  dialogVisible.value = true
  //点击修改按钮：收集已有的菜单的数据进行更新
  Object.assign(menuData, row)
}
//对话框确定按钮的回调
const save = async () => {
  //发请求：新增子菜单｜更新某一个已有的菜单的数据
  const result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    //对话框隐藏
    dialogVisible.value = false
    //提示信息
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    //再次获取最新的菜单数据
    getHasPermission()
  }
}

//删除按钮的回调
const removeMenu = async (id:number) => {
     const result = await reqRemoveMenu(id)
     if(result.code==200){
          ElMessage({type:'success',message:'删除成功'})
          //重新获取已有菜单的数据
          getHasPermission()
     }
}
</script>
<style scoped lang="scss"></style>
