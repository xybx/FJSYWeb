/*
 * @Author: WCL
 * @Date: 2022-02-25 10:03:09
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-13 13:40:42
 * @FilePath: \admin-service\src\api\monitor\dynamicmonitor-api.js
 * @Description: 动态监测API
 */
import request from '@/utils/request';

// 获取模块列表
export const getModule = () => {
    return request({
        method: 'GET',
        url: '/DTJC/GetJCYJModuleList'
    });
};

// 保存模块列表
export const saveModule = (data) => {
    return request({
        method: 'POST',
        url: '/DTJC/SaveJCYJModule',
        data
    });
};

//获取统计数据列表
export const getTJDataList=(params)=>{
    return request({
        method: 'GET',
        url: '/DTJC/GetTJDataList',
        params
    });
};


// 保存模块列表
export const importData = (data) => {
    return request({
        method: 'POST',
        url: '/DTJC/importTJData',
        data
    });
};
