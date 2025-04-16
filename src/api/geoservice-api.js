/*
 * @Author: WCL
 * @Date: 2022-02-08 16:10:06
 * @LastEditors: WCL
 * @LastEditTime: 2022-02-08 17:15:36
 * @FilePath: \admin-service\src\api\geoservice-api.js
 * @Description: 地图服务器API
 */
import request from '@/utils/request';

// 地图服务器分页
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/GetServersByPage',
        params
    });
};

// 地图服务器保存
export const saveServer = (data) => {
    return request({
        method: 'POST',
        url: '/MapServer/SaveServer',
        data
    });
};

// 地图服务器删除
export const delServer = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/DeleteServer',
        params
    });
};
