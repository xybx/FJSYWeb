import request from '@/utils/request';

// 结果字段列表
export const getResField = (params) => {
    return request({
        method: 'GET',
        url: '/business/search/result/manage/list',
        params
    });
};

// 结果字段新增/保存
export const saveResField = (data) => {
    return request({
        method: 'POST',
        url: '/business/search/result/manage/save',
        data
    });
};

// 结果字段修改
export const editResField = (data) => {
    return request({
        method: 'POST',
        url: '/business/search/result/manage/edit',
        data
    });
};

// 删除结果字段
export const delResField = (pid) => {
    return request({
        method: 'POST',
        url: '/business/search/result/manage/del/' + pid
    });
};

// 查询字段列表
export const getField = (params) => {
    return request({
        method: 'GET',
        url: '/business/search/list/manage/list',
        params
    });
};

// 新增/保存字段列表
export const saveField = (data) => {
    return request({
        method: 'POST',
        url: '/business/search/list/manage/save',
        data
    });
};

// 修改字段列表
export const editField = (data) => {
    return request({
        method: 'POST',
        url: '/business/search/list/manage/edit',
        data
    });
};

// 删除字段列表
export const delField = (pid) => {
    return request({
        method: 'POST',
        url: '/business/search/list/manage/del/' + pid,
    });
};

// 获取字段类型
export const getFieldType = () => {
    return request({
        method: 'GET',
        url: '/Condition/GetFieldType'
    });
};

// 获取控件类型
export const getCtrlType = () => {
    return request({
        method: 'GET',
        url: '/Condition/GetFieldControlType'
    });
};

// 查询条件下拉项保存
export const saveListField = (data) => {
    return request({
        method: 'POST',
        url: '/business/search/list/option/manage/save',
        data
    });
};

// 获取查询条件下拉项
export const getListField = (params) => {
    return request({
        method: 'GET',
        url: '/business/search/list/option/manage',
        params
    });
};

// 删除查询条件下拉项
export const delListField = (pid) => {
    return request({
        method: 'POST',
        url: '/business/search/list/option/manage/del/' + pid
    });
};

//角色列表下拉
export const getRuleListApi = () => {
    return request({
        method: 'GET',
        url: '/rule/all'
    });
};

// 查询条件下拉项保存
export const syncDataApi = (data) => {
    return request({
        method: 'POST',
        url: '/business/search/list/manage/sync',
        data
    });
};

// 字段列表
export const queryFieldListApi = () => {
    return request({
        method: 'GET',
        url: '/business/search/result/manage/fieldList'
    });
};