/*
 * @Author: WCL
 * @Date: 2022-02-09 10:24:58
 * @LastEditors: WCL
 * @LastEditTime: 2022-02-09 17:01:33
 * @FilePath: \admin-service\src\api\basemapconfig-api.js
 * @Description: 底图配置API
 */
import request from '@/utils/request';

// 获取列表数据
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/BaseMap/GetBaseMapsByPage',
        params
    });
};

// 通过字典配置获取底图类型
export const getModuleTypeList = (params) => {
    return request({
        method: 'GET',
        url: '/sysdictionary/list',
        params
    });
};

// 新增/编辑数据
export const saveBaseMap = (data) => {
    return request({
        method: 'POST',
        url: '/BaseMap/SaveBaseMap',
        data
    });
};

// 删除数据
export const delBaseMap = (params) => {
    return request({
        method: 'GET',
        url: '/BaseMap/DeleteBaseMap',
        params
    });
};

// 类型列表
export const getType = () => {
    return request({
        method: 'GET',
        url: '/BaseMap/GetServerType'
    });
};


