/*
 * @Author: WCL
 * @Date: 2022-02-25 13:54:56
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-21 15:17:10
 * @FilePath: \admin-service\src\api\monitor\regularassess-api.js
 * @Description: 定期评估API
 */
import request from '@/utils/request';

// 获取指标类型列表
export const getList = () => {
    return request({
        method: 'GET',
        url: '/DQPG/GetPGZBTypeList'
    });
};

// 保存指标类型
export const saveList = (data) => {
    return request({
        method: 'POST',
        url: '/DQPG/SavePGZBType',
        data
    });
};

// 删除指标类型
export const delList = (params) => {
    return request({
        method: 'GET',
        url: '/DQPG/DeletePGZBType',
        params
    });
};

// 获取指标项列表
export const getIndexList = (params) => {
    return request({
        method: 'GET',
        url: '/DQPG/GetPGZBItemList',
        params
    });
};

// 保存指标项
export const saveIndex = (data) => {
    return request({
        method: 'POST',
        url: '/DQPG/SavePGZBItem',
        data
    });
};

// 删除指标项
export const delIndex = (params) => {
    return request({
        method: 'GET',
        url: '/DQPG/DeletePGZBItem',
        params
    });
};

export const getNlmList=(params)=>{
    return request({
        method: 'GET',
        url: '/DQPG/GetPGZBItemList',
        params
    });
};

export const saveNlm=(data)=>{
    return request({
        method: 'POST',
        url: '/DQPG/SavePGZBNlm',
        data
    });
};

export const deleteNlm=(params)=>{
    return request({
        method: 'GET',
        url: '/DQPG/DeletePGZBNlm',
        params
    });
};
