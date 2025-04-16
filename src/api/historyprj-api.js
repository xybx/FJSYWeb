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
// 获取历史项目数据列表
export const getHistoryprjList = (params) => {
    return request({
        method: 'GET',
        url: '/historyprj/queryhistoryprj',
        params: params
    });
};

// 保存历史项目数据列表
export const saveHistoryprj = (form) => {
    return request({
        method: 'POST',
        url: '/historyprj/add',
        data: form
    });
}

// 删除数据
export const delHistoryprj = (id) => {
    return request({
        method: 'POST',
        url: '/historyprj/del/' + id
    });
}

// 导入数据地址
export const importDataUrl = () => {
    return request.baseURL + "/historyprj/exportbyexcel";
}

// 编辑数据
export const editEntity = (editData) => {
    return request({
        method: 'PUT',
        url: '/historyprj/editEntity',
        data: editData
    });
}

// 获取福建省下的行政区
export const queryFujianUrban = () => {
    return request({
        method: 'GET',
        url: '/historyprj/areaTree',
    });
}

// 清空所有数据
export const clearData = () => {
  return request({
      method: 'POST',
      url: '/historyprj/clearData',
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
                let fileName = '导入历史项目模板.xls'
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

// 获取金额权限列表
export const getPriceListApi = () => {
    return request({
        method: 'GET',
        url: '/historyprj/rule/list'
    });
};

// 保存金额权限
export const savePriceApi = (data) => {
    return request({
        method: 'POST',
        url: '/historyprj/rule',
        data: data
    });
}

// 删除金额权限
export const delPriceApi = (pid) => {
    return request({
        method: 'POST',
        url: '/historyprj/rule/' + pid
    });
}