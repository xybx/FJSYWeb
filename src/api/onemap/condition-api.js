/*
 * @Author: WCL
 * @Date: 2022-02-22 16:15:15
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-01 21:14:17
 * @FilePath: \fjsy-web\src\api\onemap\condition-api.js
 * @Description: 条件查询API
 */
import request from '@/utils/request';

// 条件查询类型列表
export const getTabList = () => {
    return request({
        method: 'GET',
        url: '/Condition/GetTabList'
    });
};

// 条件查询类型新增/保存
export const saveTab = (data) => {
    return request({
        method: 'POST',
        url: '/Condition/SaveTab',
        data
    });
};

// 删除查询类型
export const delTab = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/DeleteTab',
        params
    });
};

// 地图服务列表
export const getLayerList = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/GetLayerList',
        params
    });
};

// 地图服务新增/保存
export const saveLayer = (postData) => {
    return request({
        method: 'POST',
        url: '/Condition/SaveLayer',
        data: postData,
        headers: {
            "Content-type": "application/json"
        }
    });
};

// 删除地图服务
export const delLayer = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/DeleteLayer',
        params
    });
};

// 结果字段列表
export const getResField = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/GetResultField',
        params
    });
};

// 结果字段新增/保存
export const saveResField = (data) => {
    return request({
        method: 'POST',
        url: '/Condition/SaveResultField',
        data
    });
};

// 删除结果字段
export const delResField = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/DeleteResultField',
        params
    });
};

// 查询字段列表
export const getField = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/GetFields',
        params
    });
};

// 新增/保存字段列表
export const saveField = (data) => {
    return request({
        method: 'POST',
        url: '/Condition/SaveField',
        data
    });
};

// 删除字段列表
export const delField = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/DeleteField',
        params
    });
};

// 获取字段类型
export const getFieldType = () => {
    return request({
        method: 'GET',
        url: '/Condition/GetFieldType'
    });
};

// 获取控件类型
export const getCtrlType = () => {
    return request({
        method: 'GET',
        url: '/Condition/GetFieldControlType'
    });
};

// 查询条件下拉项保存
export const saveListField = (data) => {
    return request({
        method: 'POST',
        url: '/Condition/SaveListFieldValues',
        data
    });
};

// 获取查询条件下拉项
export const getListField = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/GetListFieldValues',
        params
    });
};

// 删除查询条件下拉项
export const delListField = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/DeleteListFieldValues',
        params
    });
};

//根据图层服务地址获取服务的字段列表
export const getServerFields = (params) => {
    return request({
        method: 'GET',
        url: '/Condition/GetServerLayerFields',
        params
    });
};
