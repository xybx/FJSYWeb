/*
 * @Author: WCL
 * @Date: 2021-12-06 15:59:37
 * @LastEditors: WCL
 * @LastEditTime: 2021-12-09 14:29:55
 * @FilePath: \vue-manage-system-4.2.0\src\api\index.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

export const fetchData = (params) => {
    return request({
        url: './table.json',
        method: 'GET',
        params
    });
};
