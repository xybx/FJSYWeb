/*
 * @Author: ssq
 * @Date: 2022-09-26 10:06:39
 * @LastEditors: ssq
 * @LastEditTime: 2022-09-28 11:25:08
 * @FilePath: \FJSY\src\api\dictconfig-api.js
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
 */
// 系统字典配置
import request from '@/utils/request';
// 字典列表
export const getDICTList = (params) => {
    return request({
        method: 'GET',
        url: '/sysdictionary/selectBySysdictionary',
        params,
    });
};
// 字典列表的跟新和保存
export const saveDICTType = (data) => {
    return request({
        method: 'POST',
        url: '/sysdictionary/add',
        data
    });
};
// 删除字典项
export const deleteDICTType = (params) => {
    return request({
        method: 'POST',
        url: `/sysdictionary/del/` + params,
    });
};