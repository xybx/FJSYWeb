/*
 * @Author: LJX
 * @Date: 2022-04-13 14:15:24
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-20 11:42:59
 * @FilePath: \admin-service\src\api\publicservice\publicservice-api.js
 * @Description: 意见征集api
 */

import request from '@/utils/request';

// 获取公开公示列表接口
export const getGKGSList = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/GetGKGSList',
        params
    });
};

// 保存公开公示
export const saveGKGS = (data) => {
    return request({
        method: 'POST',
        url: '/PublicService/SaveGKGS',
        data
    });
};

//删除公开公示记录
export const deleteGKGS = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/DeleteGKGS',
        params
    });
};

//获取公开公示地图服务列表接口
export const getGKGSLayerList = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/GetGKGSLayerList',
        params
    });
};

// 保存公开公示地图服务
export const saveGKGSLayer = (data) => {
    return request({
        method: 'POST',
        url: '/PublicService/SaveGKGSLayer',
        data
    });
};

//删除公开公示地图服务记录
export const deleteGKGSLayer = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/DeleteGKGSLayer',
        params
    });
};


// 获取意见征集列表接口
export const getOpinionList = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/GetOpinionList',
        params
    });
};

// 保存公开公示
export const saveOpinion = (data) => {
    return request({
        method: 'POST',
        url: '/PublicService/SaveOpinion',
        data
    });
};

//删除公开公示记录
export const deleteOpinion = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/DeleteOpinion',
        params
    });
};


// 获取违法举报列表接口
export const getWFJBList = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/GetWFJBList',
        params
    });
};


//违法举报记录状态变更
export const changestatusWFJB = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/ChangeStatus',
        params
    });
};


// 获取字典列表接口
export const getDictList = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/GetDictList',
        params
    });
};
//根据分类获取类型列表
export const getFunDictList = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/GetTypeList',
        params
    });
};

// 保存字典项
export const saveDict = (data) => {
    return request({
        method: 'POST',
        url: '/PublicService/SaveDict',
        data
    });
};

//删除字典项
export const deleteDict = (params) => {
    return request({
        method: 'GET',
        url: '/PublicService/DeleteDict',
        params
    });
};