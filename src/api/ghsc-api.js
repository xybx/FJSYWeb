/*
 * @Author: LJX
 * @Date: 2022-03-18 13:20:41
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-21 13:03:04
 * @FilePath: \admin-service\src\api\ghsc-api.js
 * @Description: 规划审查接口
 */
import request from '@/utils/request';

// 获取列表数据
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/GHSC/GetListByPage',
        params
    });
};

//获取项目规划类型列表
export const getGHTypeList = () => {
    return request({
        method: 'GET',
        url: '/GHSC/GetGHTypes',
    });
};

//获取项目列表
export const getPRJList = (params) => {
    return request({
        method: 'GET',
        url: '/GHSC/GetProjectList',
        params
    });
};

//获取阶段列表
export const getJDList = (params) => {
    return request({
        method: 'GET',
        url: '/GHSC/GetJDList',
        params
    });
};

//获取数据类型列表
export const getDataTypeList = () => {
    return request({
        method: 'GET',
        url: '/GHSC/GetDataTypes',
    });
};

//保存
export const setSave = (data) => {
    return request({
        method: 'POST',
        url: '/GHSC/Save',
        data
    });
};

//获取数据类型列表
export const Delete = (params) => {
    return request({
        method: 'GET',
        url: '/GHSC/Delete',
        params
    });
};