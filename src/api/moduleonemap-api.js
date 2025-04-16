/*
 * @Author: LJX
 * @Date: 2022-02-11 16:38:52
 * @LastEditors: ssq
 * @LastEditTime: 2022-09-28 13:33:12
 * @FilePath: \FJSY\src\api\moduleonemap-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

// 获取一张图以及菜单模块列表
export const getModuleParentList = (params) => {
    return request({
        method: 'GET',
        url: '/module/selectTreeMenu',
        params
    });
};
//保存一级菜单

export const SaveModuleParent = (data) => {
    return request({
        method: 'POST',
        url: '/module/update',
        data
    })
}
// 保存子级菜单接口
export const SaveModule = (data) => {
    return request({
        method: 'POST',
        url: '/ModuleOneMap/SaveModule',
        data
    })
}
// 删除一级菜单
export const DeleteModuleParent = (params) => {
    return request({
        method: 'POST',
        url: '/module/del/' + params,
    });
};
// 删除二级子菜单
export const DeleteModule = (params) => {
    return request({
        method: 'POST',
        url: '/module/del/' + params,
    });
};
// 获取一张图所有菜单列表三级级联结构
export const GetModuleAllList = (params) => {
    return request({
        method: 'GET',
        url: '/ModuleOneMap/GetModuleAllList',
        params
    });
};

// 根据父ID获取子菜单的列表
export const GetModuleList = (params) => {
    return request({
        method: 'GET',
        url: '/ModuleOneMap/GetModuleList',
        params
    });
};

//获取菜单权限列表
export const GetModuleAuthList = (params) => {
    return request({
        method: 'GET',
        url: '/ModuleOneMap/GetModuleAuths',
        params
    });
};

//保存菜单权限
export const SaveModuleAuth = (data) => {
    return request({
        method: 'POST',
        url: '/ModuleOneMap/SaveModuleAuth',
        data
    })
}

//删除菜单权限
export const DeleteModuleAuth = (data) => {
    return request({
        method: 'POST',
        url: '/ModuleOneMap/DeleteModuleAuth',
        data
    })
}

// 获取父级菜单列表
export const getParentMenuList = () => {
    return request({
        method: 'GET',
        url: '/module/parentMenuList',
    })
}

