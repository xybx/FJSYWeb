import request from '@/utils/request';

// 获取展示字段列表
export const getLayerResultPageApi = (params) => {
    return request({
        method: 'GET',
        url: '/historyprj/layer/result/page',
        params
    });
};

// 保存展示字段
export const saveLayerResultApi = (data) => {
    return request({
        method: 'POST',
        url: '/historyprj/layer/result',
        data: data
    });
};

// 删除展示字段
export const delLayerResultApi = (pid) => {
    return request({
        method: 'POST',
        url: '/historyprj/layer/result/' + pid
    });
};

// 角色列表下拉
export const getRuleListApi = () => {
    return request({
        method: 'GET',
        url: '/rule/all'
    });
};

// 字段列表下拉
export const getFieldsListApi = () => {
    return request({
        method: 'GET',
        url: '/historyprj/layer/result/fields'
    });
};

// 字段列表下拉
export const syncDataApi = (data) => {
    return request({
        method: 'post',
        url: '/historyprj/layer/result/sync',
        data: data
    });
};