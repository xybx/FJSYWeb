/*
 * @Author: WCL
 * @Date: 2022-01-25 09:36:14
 * @LastEditors: ssq
 * @LastEditTime: 2022-09-26 14:48:25
 * @FilePath: \FJSY\src\api\home-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

// 获取用户菜单模块
export const getRuleModule = (params, token) => {
    return request({
        Headers: {
            Authorization: token
        },
        method: 'GET',
        url: '/module/selectModule',
        params: params
    });
};
