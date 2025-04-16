/*
 * @Author: LJX
 * @Date: 2022-02-25 09:36:29
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-04 13:34:11
 * @FilePath: \admin-service\src\api\onemap\city-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';
// 获取行政区规划图层服务列表
export const getCityLayers = (params) => {
    return request({
        method: 'GET',
        url: '/City/GetCityLayers',
        params
    });
};
// 保存行政区规划图层
export const saveCityLayer = (data) => {
    return request({
        method: 'POST',
        url: '/City/SaveCityLayer',
        data
    });
};

// 删除行政区规划图层
export const deleteCityLayer = (params) => {
    return request({
        method: 'GET',
        url: '/City/DeleteCityLayer',
        params
    });
};

//行政区界别下拉列表
export const getXZQJBList = (params) => {
    return request({
        method: 'GET',
        url: '/City/GetXZQJBType',
        params
    });
};
