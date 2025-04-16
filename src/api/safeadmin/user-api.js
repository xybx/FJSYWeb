/*
 * @Author: LJX
 * @Date: 2022-02-14 11:10:18
 * @LastEditors: ssq
 * @LastEditTime: 2022-10-31 09:45:14
 * @FilePath: \fjsy-web\src\api\safeadmin\user-api.js
 * @Description: 请填写描述
 */

import request from '@/utils/request';

// 获取列表数据
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/user/findlist',
        params
    });
};

//保存用户
export const saveUser = (data) => {
    return request({
        method: 'POST',
        url: '/user/add',
        data
    });
};

//删除用户
export const DeleteUser = (params) => {
    return request({
        method: 'POST',
        url: '/user/del/' + params,
    });
};

//设置用户角色
export const setUserRole = (params) => {
    return request({
        method: 'GET',
        url: '/User/SaveUserRule',
        params
    });
};

//获取用户角色id列表
export const getUserRoles = (params) => {
    return request({
        method: 'GET',
        url: '/User/getUserRoles',
        params
    });
};

//获取用户信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/User/GetUserInfo'
    });
};

//同步科室信息
export const UpdataOffice = (params) => {
    return request({
        method: 'GET',
        url: '/UserModule/UpdataOffice',
        params
    });
};
//同步用户信息
export const UpdataUser = (params) => {
    return request({
        method: 'GET',
        url: '/UserModule/UpdataUser',
        params
    });
};
// 用户权限验证
export const yzLogin = (params) => {
    return request({
        metho: 'GET',
        url: '/Login/TokenLogin',
        params
    });
};
