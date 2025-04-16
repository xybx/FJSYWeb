/*
 * @Author: WCL
 * @Date: 2022-01-25 10:58:18
 * @LastEditors: LJX
 * @LastEditTime: 2022-05-16 16:50:09
 * @FilePath: \admin-service\src\api\mapservice-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

// 获取服务分组树结构列表
export const getTreeGroups = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/GetGroups',
        params
    });
};

// 根据图层分组ID获取服务列表
export const getWebGisLayers = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/GetWebGisLayers',
        params
    });
};

// 分组新增和修改
export const saveGroup = (data) => {
    return request({
        method: 'POST',
        url: '/MapServer/SaveGroup',
        data
    });
};

// 分组删除
export const delGroup = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/DeleteGroup',
        params
    });
};

// 服务器列表
export const getServers = () => {
    return request({
        method: 'GET',
        url: '/MapServer/GetServers'
    });
};

// 服务名称列表
export const getServeName = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/GetServices',
        params
    });
};

// 服务类型列表
export const getServeType = () => {
    return request({
        method: 'GET',
        url: '/MapServer/GetMapKinds'
    });
};

// 数据来源列表
export const getDataResource = () => {
    return request({
        method: 'GET',
        url: '/MapServer/GetMapDataSources'
    });
};

// 保存地图服务
export const saveMapServe = (data) => {
    return request({
        method: 'POST',
        url: '/MapServer/SaveWebGisLayer',
        data
    });
};

// 删除地图服务
export const delMapServer = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/DeleteLayer',
        params
    });
};
