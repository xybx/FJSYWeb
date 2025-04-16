/*
 * @Author: LJX
 * @Date: 2022-02-11 17:01:20
 * @LastEditors: ssq
 * @LastEditTime: 2022-09-28 10:02:27
 * @FilePath: \FJSY\src\api\safeadmin\depart-api.js
 * @Description: 部门管理api
 */

import request from '@/utils/request';

// 获取列表数据
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/office/selectByName',
        params
    });
};

//科室下拉
export const getAllOfficeList = () => {
    return request({
        method: 'GET',
        url: '/office/all',
    });
};

//行政区下拉列表
export const getXZQList = () => {
    return request({
        method: 'GET',
        url: '/api/ZBMX/GetXZQList',
    });
};

//保存科室
export const saveOffice = (data) => {
    return request({
        method: 'POST',
        url: '/office/add',
        data
    });
};


//禁用科室
export const enableOffice = (params) => {
    return request({
        method: 'post',
        url: '/office/update',
        data: params
    });
};
//同步科室信息
export const UpdataOffice = (params) => {
    return request({
        method: 'GET',
        url: '/UserModule/UpdataOffice',
        params
    });
}

