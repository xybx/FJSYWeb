/*
 * @Author: LJX
 * @Date: 2022-02-25 16:28:58
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-15 17:15:45
 * @FilePath: \admin-service\src\api\evaluation-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';
// 获取分析评价类型列表
export const getFXPJTypeList = ()=>{
    return request({
        method:'GET',
        url:'/FXPJ/GetFXPJTypeList',
    })
}
// 获取分析评价新增列表类型
export const saveFXPJType = (data) => {
    return request({
        method: 'POST',
        url: '/FXPJ/SaveFXPJType',
        data
    });
};
// 删除分析评价类型列表
export const deleteFXPJType = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/DeleteFXPJType`,
        params
    });
};
// 获取分析评价图层列表
export const getFXPJLayerList = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/GetFXPJLayerList`,
        params
    });
};
// 分析评价图层新增，更新的保存
export const saveFXPJLayer = (data) => {
    return request({
        method: 'POST',
        url: '/FXPJ/SaveFXPJLayer',
        data
    });
};
// 删除分析评价图层
export const deleteFXPJLayer = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/DeleteFXPJLayer`,
        params
    });
};

// 获取分析评价说明表
export const getFXPJSMList = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/GetFXPJSMList`,
        params
    });
};
// 分析评价说明新增，更新
export const saveFXPJSM = (data) => {
    return request({
        method: 'POST',
        url: '/FXPJ/SaveFXPJSM',
        data
    });
};
// 删除分析评价说明
export const deleteFXPJSM = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/DeleteFXPJSM`,
        params
    });
};
// 分析评价类型
export const getFXPJCategoryType = ()=>{
    return request({
        method:'GET',
        url:'/FXPJ/GetFXPJCategoryType',
    })
}
// 文件上传
export const  uploadfile = (data) => {
    return request({
        method: 'POST',
        url: '/Upload/uploadfile',
        data
    });
};

//双评估的统计
export const getSPGTJList = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/GetSPGTJList`,
        params
    });
};

//双评价适宜性的统计
export const getSPJSYXTJList = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/GetSPJTJList`,
        params
    });
};

//双评价行政区的统计
export const getSPJXZQTJList = (params) => {
    return request({
        method: 'GET',
        url: `/FXPJ/GetSPJXZQTJList`,
        params
    });
};

// 保存模块列表
export const importData = (data) => {
    return request({
        method: 'POST',
        url: '/FXPJ/importTJData',
        data
    });
};