<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索:">
          <el-input
            placeholder="请你输入职位关键字"
            v-model="keyword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            :disabled="keyword ? false : true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">
        添加职位
      </el-button>
      <!-- table 展示用户信息 -->
      <el-table style="margin: 10px 0" border :data="allRole">
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="职位名称"
          align="center"
          show-overflow-tooltip
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          show-overflow-tooltip
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          show-overflow-tooltip
          prop="updateTime"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setPermisstion(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm :title="`你确定要删除${row.roleName}?`" @confirm="removeRole(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @current-change="getHasRole"
        @size-change="sizeChange"
      />
    </el-card>
    <!-- 添加职位与更新已有职位：对话框 -->
    <el-dialog
      v-model="dialogTableVisible"
      :title="roleParams.id ? '更新职位' : '添加职位'"
    >
      <el-form :model="roleParams" :rules="rules" ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input
            placeholder="请输入职位名称"
            v-model="roleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree
        ref="tree"
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission , reqRemoveRole} from '../../../api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList
} from '../../../api/acl/role/type'
//引入仓库
import useLayoutSettingStore from '../../../store/modules/setting'
import { ElMessage } from 'element-plus'
const settingStore = useLayoutSettingStore()
//默认页码
const pageNo = ref<number>(1)
//一页展示几条数据
const pageSize = ref<number>(10)
//总条数
const total = ref<number>(0)
//搜索职位关键字
const keyword = ref<string>('')
//存储全部已有的职位
const allRole = ref<Records>([])
//控制对话框的显示与隐藏
const dialogTableVisible = ref<boolean>(false)
//收集新增岗位数据
const roleParams = reactive<RoleData>({
  roleName: '',
})
//获取 form 组件实例
const form = ref<any>()
//控制抽屉显示与隐藏
const drawer = ref<boolean>(false)
//定义数组存储用户权限的数据
const menuArr = ref<MenuList>([])
//准备一个数组：数组用于存储勾选的节点 ID（四级）
const selectArr = ref<number[]>([])
//获取树的组件实例
const tree = ref<any>()
//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole() //获取全部用户信息的方法｜分页器当前页码发生变化的回调
})
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    allRole.value = result.data.records
    total.value = result.data.total
  }
}
//下拉菜单的回调
const sizeChange = () => {
  getHasRole()
}
//搜索按钮的回调
const search = () => {
  //再次发送请求关键字
  getHasRole()
  // keyword.value = ''
}
//重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

//添加职位按钮的回调
const addRole = () => {
  //显示对话框
  dialogTableVisible.value = true
  //清空数据
  Object.assign(roleParams, { roleName: '', id: 0 })
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
//编辑职位按钮的回调
const updateRole = (row: RoleData) => {
  //显示对话框
  dialogTableVisible.value = true
  //存储已有的职位--带有 id
  Object.assign(roleParams, row)
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

//自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
//确定按钮的回调
const save = async () => {
  //表单校验结果，结果通过再发请求，没有通过不发请求
  await form.value.validate()
  //添加职位｜更新职位的请求
  const result: any = await reqAddOrUpdateRole(roleParams)
  if (result.code == 200) {
    //提示文字
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功',
    })
    //关闭对话框
    dialogTableVisible.value = false
    //再次获取全部已有的职位
    getHasRole(roleParams.id ? pageNo.value : 1)
  }
}

//分配权限按钮的回调 -- 已有的职位数据
const setPermisstion = async (row:RoleData) => {
  //显示抽屉
  drawer.value = true
  //收集当前要分类权限的职位的数据
  Object.assign(roleParams,row)
  //根据职位获取权限的数据
  const result:MenuResponseData = await reqAllMenuList((roleParams.id as number))
  if(result.code==200){
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
//树形控件测试数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

const filterSelectArr = (allData:any,initArr:any) => {
  allData.forEach((item:any) => {
    if(item.select && item.level == 4){
      initArr.push(item.id)
    }
    if(item.children && item.children.length>0){
      filterSelectArr(item.children, initArr)
    }
  });
  return initArr
}

//抽屉确定按钮的回调
const confirmClick =async () => {
  //职位的 ID
  const roleId = (roleParams.id as number)
  //选中节点的 ID
  const arr = tree.value.getCheckedKeys()
  //半选的 ID
  const arr1 = tree.value.getHalfCheckedKeys()
  //合并
  const permissionId = arr.concat(arr1)
  //下发权限
  const result:any = await reqSetPermission(roleId, permissionId)
  if(result.code == 200){
    //抽屉关闭
    drawer.value = false
    //提示信息
    ElMessage({type:'success',message:'分配权限成功'})
    //页面刷新
    window.location.reload()
  }
}

//删除已有职位的回调
const removeRole =async (id:number) => {
  const result:any = await reqRemoveRole(id)
  if(result.code == 200){
    //提示信息
    ElMessage({type:'success',message:'删除成功'})
    getHasRole(allRole.value.length>1?pageNo.value:pageNo.value-1)
  }
}

</script>
<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
