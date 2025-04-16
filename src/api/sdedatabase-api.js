/*
 * @Author: WCL
 * @Date: 2022-02-09 09:44:44
 * @LastEditors: WCL
 * @LastEditTime: 2022-02-09 10:11:16
 * @FilePath: \admin-service\src\api\sdedatabase-api.js
 * @Description: 空间数据库API
 */
import request from '@/utils/request';

// 获取列表数据
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/SdeDatabase/GetSDEDatabaseList',
        params
    });
};

// 新增/保存数据源
export const saveSdeData = (data) => {
    return request({
        method: 'POST',
        url: '/SdeDatabase/SaveSDEDatabase',
        data
    });
};

// 删除数据源
export const delSdeData = (params) => {
    return request({
        method: 'GET',
        url: '/SdeDatabase/DSDelete',
        params
    });
};
