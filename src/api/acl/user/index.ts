//用户管理模块的接口
import request from "../../../utils/request";
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from "./type";
//枚举地址
enum API{
     //获取全部已有的用户账户信息
     ALLUSER_URL = '/admin/acl/user/',
     //添加一个新的用户账号
     ADDUSER_URL = '/admin/acl/user/save',
     //更新已有的用户账号
     UPDATEUSER_URL = '/admin/acl/user/update',
     //获取全部职位，当前账户拥有的职位接口
     ALLROLE_URL = '/admin/acl/user/toAssign/',
     //给已有的用户分配角色接口
     SETROLE_URL = '/admin/acl/user/doAssignRole',
     //删除某一个账号
     DELETEUSER_URL = '/admin/acl/user/remove/',
     //批量删除的接口
     DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}
//获取全部已有的用户账户信息接口
export const reqUserInfo = (page:number,limit:number,username:string) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data:User) => {
     //携带参数有 id 更新
     if(data.id){
          return request.put<any, any>(API.UPDATEUSER_URL, data)
     }else {
          return request.post<any, any>(API.ADDUSER_URL, data)
     }
}
//获取全部职位，当前账户拥有的职位接口
export const reqAllRole = (adminId:number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL+adminId)
//给已有的用户分配角色接口
export const reqSetUserRole = (data:SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)
//删除某一个账号的接口
export const reqRemoveUser = (userId:number) => request.delete<any, any>(API.DELETEUSER_URL+userId)
//批量删除的接口
export const reqSelectRemoveUser = (idList:number[]) => request.delete(API.DELETEALLUSER_URL,{data:idList})
