/*
 * @Author: WCL
 * @Date: 2022-02-24 15:59:12
 * @LastEditors: WCL
 * @LastEditTime: 2022-02-24 17:17:48
 * @FilePath: \admin-service\src\api\onemap\projectcheck-api.js
 * @Description: 项目核查
 */
import request from '@/utils/request';

// 项目核查图层列表
export const getLayerList = () => {
    return request({
        method: 'GET',
        url: '/XMHC/GetXMHCLayerList'
    });
};

// 新增/编辑图层列表
export const saveLayer = (data) => {
    return request({
        method: 'POST',
        url: '/XMHC/SaveXMHCLayer',
        data
    });
};

// 删除图层
export const delLayer = (params) => {
    return request({
        method: 'GET',
        url: '/XMHC/DeleteXMHCLayer',
        params
    });
};

// 结果字段配置列表
export const getResList = () => {
    return request({
        method: 'GET',
        url: '/XMHC/GetXMHCResultFieldList'
    });
};

// 编辑/新增结果字段
export const saveRes = (data) => {
    return request({
        method: 'POST',
        url: '/XMHC/SaveXMHCResultField',
        data
    });
};

// 删除结果字段
export const delRes = (params) => {
    return request({
        method: 'GET',
        url: '/XMHC/DeleteXMHCResultField',
        params
    });
};

// 清空结果字段
export const emptyRes = (params) => {
    return request({
        method: 'GET',
        url: '/XMHC/DeleteAllXMHCResultFields',
        params
    });
};

// 导入结果字段文件
export const exportRes = (data) => {
    return request({
        method: 'POST',
        url: '/XMHC/ExportResultFields',
        data
    });
};

// 地图服务数据阶段
export const getMapStage = () => {
    return request({
        method: 'GET',
        url: '/XMHC/GetMapServerDataJD'
    });
};
