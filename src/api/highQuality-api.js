/*
 * @Author: ssq
 * @Date: 2022-11-11 10:35:42
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 10:35:44
 * @FilePath: \fjsy-web\src\api\highQuality-api.js
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
 */
import request from '@/utils/request';

// 删除数据
export const delCity = () => {
    return request({
        method: 'POST',
        url: '/highQuality/del/city/'
    });
}

// 删除数据
export const delCounty = () => {
    return request({
        method: 'POST',
        url: '/highQuality/del/county/'
    });
}

// 根据id删除数据
export const delById = (id) => {
    return request({
        method: 'POST',
        url: '/highQuality/manage/del/' + id
    })
}

// 修改数据内容
export const editData = (data) => {
    return request({
        method: 'POST',
        url: '/highQuality/manage/edit',
        data: data
    })
}

// 获取列表数据
export const getAll = (param) => {
    return request({
        method: 'GET',
        url: '/highQuality/manage/list',
        params: param
    });
}

// 保存数据
export const save = (data) => {
    return request({
        method: 'POST',
        url: '/highQuality/manage/save',
        data: data
    })
}

// 同步arcgis layerid
export const syncArcgisLayerId = (data) => {
    return request({
        method: 'POST',
        url: '/highQuality/arcgis/sync/layerId',
        data: data
    })
}

// 导入数据地址
export const importDataUrl = () => {
    return request.baseURL + "/highQuality/import";
}