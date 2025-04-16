/*
 * @Author: WCL
 * @Date: 2022-02-11 11:40:34
 * @LastEditors: LJX
 * @LastEditTime: 2022-05-24 15:48:00
 * @FilePath: \admin-service\src\api\onemap\querylocate-api.js
 * @Description: 查询定位API
 */
import request from '@/utils/request';

// 获取图层服务列表
export const getLocateLayers = (params) => {
    return request({
        method: 'GET',
        url: '/QueryLocation/GetQueryLocationLayers',
        params
    });
};

// 保存查询定位图层
export const saveLocateLayer = (data) => {
    return request({
        method: 'POST',
        url: '/QueryLocation/SaveQueryLocationLayer',
        data
    });
};

// 删除查询定位图层
export const delLocateLayer = (params) => {
    return request({
        method: 'GET',
        url: '/QueryLocation/DeleteQueryLocationLayer',
        params
    });
};

// 子图层列表
export const getChildLayer = (params) => {
    return request({
        method: 'GET',
        url: '/QueryLocation/GetQueryChilds',
        params
    });
};

// 保存子图层配置
export const saveChildLayer = (data) => {
    return request({
        method: 'POST',
        url: '/QueryLocation/SaveQueryChild',
        data
    });
};

// 删除子图层配置
export const delChildLayer = (params) => {
    return request({
        method: 'GET',
        url: '/QueryLocation/DeleteQueryChild',
        params
    });
};

// 子图层ID列表
export const getChildServer = (params) => {
    return request({
        method: 'GET',
        url: '/QueryLocation/GetServerLayers',
        params
    });
};

// 子图层字段列表
export const getChildField = (params) => {
    return request({
        method: 'GET',
        url: '/QueryLocation/GetServerLayerFields',
        params
    });
};
