/*
 * @Author: LJX
 * @Date: 2022-02-27 17:20:55
 * @LastEditors: LJX
 * @LastEditTime: 2022-02-27 17:27:39
 * @FilePath: \admin-service\src\api\systemmenu-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

//菜单列表
export const getModuleList = (params) => {
    return request({
        method: 'GET',
        url: '/Module/GetModules',
        params
    });
};
// 保存子级菜单
export  const saveModule=(data)=>{
    return request({
        method:'POST',
        url:'/Module/Save_Module',
        data
    })
}
// 删除子级菜单
export const deleteModule=(params)=>{
    return request({
        method:'GET',
        url:'/Module/Delete_Module',
        params,
    })
}