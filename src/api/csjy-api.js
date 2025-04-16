/*
 * @Author: ssq
 * @Date: 2022-10-11 18:08:19
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-02 14:13:09
 * @FilePath: \fjsy-web\src\api\csjy-api.js
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
 */
import request from '@/utils/request';
// 获取城市经营图层服务列表
export const getCSJYLayers = () => {
    return request({
        method: 'GET',
        url: '/CSJY/GetCSJYLayers'
    });
};
//  保存城市经营图层
export const SaveCSJYLayer = (data) => {
    return request({
        method: 'POST',
        url: '/CSJY/SaveCSJYLayer',
        data
    });
};
// 删除城市经营图
export const DeleteCSJYLayer = (params) => {
    return request({
        method: 'GET',
        url: `/CSJY/DeleteCSJYLayer/`,
        params
    });
};
// 根据输入的图层服务地址获取该服务下的子图层 接口
export const getServerLayers = (params) => {
    return request({
        method: 'GET',
        url: '/ZTT/GetServerLayers',
        params
    });
};
