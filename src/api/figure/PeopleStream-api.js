import request from '@/utils/request';
import axios from 'axios';

// 分页获取人口流动列表数据
export const queryPageApi = (params) => {
    return request({
        method: 'GET',
        url: '/people/stream/manage/page',
        params: params
    });
};

// 新增或编辑数据
export const saveOrEditApi = (data) => {
    return request({
        method: 'POST',
        url: '/people/stream/manage/saveOrEdit',
        data: data
    });
};

// 同步数据到es中
export const syncDataApi = (pid) => {
    return request({
        method: 'POST',
        url: '/people/stream/manage/sync/' + pid
    })
}

// 同步行政区wkt数据到es中
export const syncAreaApi = () => {
    return request({
        method: 'POST',
        url: '/people/stream/manage/sync/area',
    })
}

// 构造行政区树形数据
export const constructTreeApi = () => {
    return request({
        method: 'POST',
        url: '/people/stream/manage/area/tree',
    })
}

// 导入数据地址
export const uploadCsvApi = () => {
    return window.apiURL + "/people/stream/csv/manage/upload";
}

// 同步数据到es中
export const csvDelApi = (pid) => {
    return request({
        method: 'POST',
        url: '/people/stream/csv/manage/del/' + pid
    })
}

// 同步行政区wkt数据到es中
export const csvEditApi = (data) => {
    return request({
        method: 'POST',
        url: '/people/stream/csv/manage/edit',
        data: data
    })
}

// 构造行政区树形数据
export const csvPageApi = (params) => {
    return request({
        method: 'GET',
        url: '/people/stream/csv/manage/page',
        params
    })
}