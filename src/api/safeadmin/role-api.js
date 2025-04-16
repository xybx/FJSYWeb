/*
 * @Author: LJX
 * @Date: 2022-02-14 10:31:57
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-07 16:15:41
 * @FilePath: \fjsy-web\src\api\safeadmin\role-api.js
 * @Description: 请填写描述
 */

import request from '@/utils/request';

// 获取列表数据
export const getListByPage = (params) => {
    return request({
        method: 'GET',
        url: '/rule/selectByRule',
        params
    });
};

//角色列表下拉
export const getRuleList = () => {
    return request({
        method: 'GET',
        url: '/rule/all'
    });
};

//保存角色
export const saveRule = (data) => {
    return request({
        method: 'POST',
        url: '/rule/save',
        data
    });
};

//删除角色
export const deleteRule = (params) => {
    return request({
        method: 'POST',
        url: '/rule/del/' + params
    });
};

// 角色运维菜单权限列表
export const getYWList = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetRuleModules',
        params
    });
};

// 角色一张图菜单权限列表
export const getOnemapModule = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetOneMapRuleModules',
        params
    });
};

// 角色一张图地图服务权限
export const getOnemapWebGIS = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetRuleWebGisLayers',
        params
    });
};

// 角色一张图红线下载权限
export const getOnemapHX = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetRuleHXDownloadLayers',
        params
    });
};

// 角色一张图条件查询权限
export const getOnemapCond = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetRuleConditions',
        params
    });
};

// 角色一张图查询定位权限
export const getOnemapLocate = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetRuleQueryLocation',
        params
    });
};

// 角色一张图分析评价权限
export const getOnemapFXPJ = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetRuleFXPJLayers',
        params
    });
};

// 角色一张图合规审查权限
export const getOnemapHGSC = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/GetRuleHgscLayers',
        params
    });
};

// 角色运维系统菜单保存
export const saveYWList = (data) => {
    return request({
        method: 'POST',
        url: '/Rule/SaveRuleModules',
        data
    });
};

// 角色运维系统菜单删除
export const delYWList = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/DeleteRuleModule',
        params
    });
};

// 角色一张图权限保存
// type: 1:地图服务，2：红线下载图层 3：合规审查图层， 4 ：分析评价图层,5:条件查询 ,
export const saveOnemap = (data) => {
    return request({
        method: 'POST',
        url: '/Rule/SaveRuleLayers',
        data
    });
};

// 角色一张图权限删除
export const delOnemap = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/DeleteRuleLayer',
        params
    });
};

// 角色系统菜单权限保存
export const saveOnemapModule = (data) => {
    return request({
        method: 'POST',
        url: '/Rule/SaveOneMapRuleModules',
        data
    });
};

// 角色系统菜单权限删除
export const delOnemapModule = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/DeleteOneMapRuleModule',
        params
    });
};

// 保存一张图查询定位
export const saveOnemapLocate = (data) => {
    return request({
        method: 'POST',
        url: '/Rule/SaveRuleQueryLocation',
        data
    });
};

// 删除一张图查询定位
export const delOnemapLocate = (params) => {
    return request({
        method: 'GET',
        url: '/Rule/DeleteRuleQueryLocation',
        params
    });
};


export const getPopedomTree = (params) => {
    return request({
        method: 'GET',
        url: '/popedom/getPopedomTree',
        params
    });
}

export const getPopedomByRule = (params) => {
    return request({
        method: 'GET',
        url: '/popedom/getPopedomByRule',
        params
    });
}

export const editPopedomByRule = (params) => {
    return request({
        method: 'POST',
        url: '/rule/editPopedom',
        data: params
    });
}

export const queryPopedomList = () => {
    return request({
        method: 'GET',
        url: '/popedom/list',
    });
}

export const tucengGetPopedomByRule = (params) => {
    return request({
        method: 'GET',
        url: '/popedom/getLayerByRule',
        params
    });
}

export const tucengEditPopedomByRule = (params) => {
    return request({
        method: 'POST',
        url: '/rule/editLayer',
        data: params
    });
}

export const tucengGetPopedomTree = () => {
    return request({
        method: 'GET',
        url: '/popedom/layer/list',
    });
}