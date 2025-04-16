/*
 * @Author: ssq
 * @Date: 2022-09-26 16:02:20
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 10:38:47
 * @FilePath: \fjsy-web\src\api\historyprj-api.js
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
 */

import request from '@/utils/request';
import axios from 'axios';

// 获取数据列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/cityHealth/manage/page',
        params: params
    });
};

// 获取数据列表
export const getYearList = (params) => {
    return request({
        method: 'GET',
        url: '/cityHealth/year',
        params: params
    });
};

// 保存历史项目数据列表
export const save = (form) => {
    return request({
        method: 'POST',
        url: '/cityHealth/manage/save',
        data: form
    });
}

// 删除数据
export const del = (id) => {
    return request({
        method: 'POST',
        url: '/cityHealth/manage/del/' + id
    });
}

// 同步图层id
export const syncLayerId = () => {
    return request({
        method: 'POST',
        url: '/cityHealth/manage/sync'
    });
}

// 导入数据地址
export const importDataUrl = () => {
    return request.baseURL + "/cityHealth/manage/import";
}

// 编辑数据
export const editEntity = (editData) => {
    return request({
        method: 'POST',
        url: '/cityHealth/manage/edit',
        data: editData
    });
}

// 清空所有数据
export const clearDataByYear = (year) => {
  return request({
      method: 'POST',
      url: '/cityHealth/manage/clearAll/' + year,
  });
}

export const clearData = () => {
    return request({
        method: 'POST',
        url: '/cityHealth/manage/clearAll',
    });
}

// 下载模板
export function exportExcel(url, token = {}) {
    return new Promise((resolve, reject) => {
        axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
        axios({
            method: 'get',
            url: url, // 请求地址
            responseType: 'blob', // 表明返回服务器返回的数据类型
            headers: {
                Authorization: token,
                loginType: 'system'
            }
        }).then(
            response => {
                resolve(response.data)
                let blob = new Blob([response.data], {
                    type: 'application/vnd.ms-excel'
                })
                console.log(blob)
                let fileName = '导入城市体检数据模板.xlsx'
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName)
                } else {
                    var link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = fileName
                    link.click()
                    //释放内存
                    window.URL.revokeObjectURL(link.href)
                }
            },
            err => {
                reject(err)
            }
        )
    })
}



//获取指标维度列表
export const getDimensionList = (params) => {
    return request({
        method: 'GET',
        url: '/dimension-type/selectByCityQualityPromoteDimensionType',
        params: params
    });
};

//新增指标维度
export const addDimension = (params) => {
    return request({
        method: 'POST',
        url: '/dimension-type/add',
        data: params
    });
};

//编辑指标维度
export const editDimension = (params) => {
    return request({
        method: 'POST',
        url: '/dimension-type/update',
        data: params
    });
};

//删除指标维度
export const deleteDimension = (params) => {
    return request({
        method: 'POST',
        url: '/dimension-type/del',
        data: params
    });
};

//获取指标维度下拉数据
export const getDimensionSelect = (params) => {
    return request({
        method: 'GET',
        url: '/dimension-type/getDimensionSelect',
        params: params
    });
};
