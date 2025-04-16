/*
 * @Author: WCL
 * @Date: 2022-02-11 09:22:27
 * @LastEditors: WCL
 * @LastEditTime: 2022-02-11 10:04:59
 * @FilePath: \admin-service\src\api\onemap\hxdownload-api.js
 * @Description: 红线下载API
 */
import request from '@/utils/request';

// 获取红线下载列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/HXDownload/GetHXDownloadLayers',
        params
    });
};

// 保存红线下载配置
export const saveData = (data) => {
    return request({
        method: 'POST',
        url: '/HXDownload/SaveHXDownloadLayer',
        data
    });
};

// 删除红线下载配置
export const delData = (params) => {
    return request({
        method: 'GET',
        url: '/HXDownload/DeleteHXDownloadLayer',
        params
    });
};

// 获取数据资源-地图服务列表
export const getWebGis = () => {
    return request({
        method: 'GET',
        url: '/HXDownload/GetWebGisLayers'
    });
};

// 获取SDE库配置列表
export const SdeList = () => {
    return request({
        method: 'GET',
        url: '/HXDownload/GetSdeDatabaseList'
    });
};

// 根据地图服务PID获取子图层
export const getServerLayers = (params) => {
    return request({
        method: 'GET',
        url: '/HXDownload/GetServerLayers',
        params
    });
};
