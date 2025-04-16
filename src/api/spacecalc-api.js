/*
 * @Author: WCL
 * @Date: 2022-02-08 14:59:26
 * @LastEditors: tao
 * @LastEditTime: 2022-11-02 11:26:54
 * @FilePath: \admin-service\src\api\spacecalc-api.js
 * @Description: 空间引擎API
 */
import request from '@/utils/request';

// 获取空间引擎列表
export const getGeoServiceList = (params) => {
    return request({
        method: 'GET',
        url: '/MapGeoService/GetMapGeoServicesByPage',
        params
    });
};

// 编辑/新增空间引擎
export const saveGeoService = (data) => {
    return request({
        method: 'POST',
        url: '/MapGeoService/SaveMapGeoService',
        data
    });
};

// 删除空间引擎
export const delGeoService = (params) => {
    return request({
        method: 'GET',
        url: '/MapGeoService/DeleteMapGeoService',
        params
    });
};
