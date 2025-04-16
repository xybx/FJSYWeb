/*
 * @Author: LJX
 * @Date: 2022-04-19 18:22:46
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-19 18:24:11
 * @FilePath: \admin-service\src\api\logmanage-api.js
 * @Description: 日志管理接口
 */
import request from '@/utils/request';



// 日志列表
export const getlist = (params) => {
    return request({
        method: 'GET',
        url: '/Log/GetLogList',
        params
    });
};