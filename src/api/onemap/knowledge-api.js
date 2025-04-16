/*
 * @Author: WCL
 * @Date: 2022-02-22 15:48:09
 * @LastEditors: WCL
 * @LastEditTime: 2022-02-24 14:19:58
 * @FilePath: \admin-service\src\api\onemap\knowledge-api.js
 * @Description: 知识库API
 */
import request from '@/utils/request';

// 获取知识库类型列表
export const getTypeList = (params) => {
    return request({
        method: 'GET',
        url: '/Knowledge/GetKnowledgeBaseTypeList',
        params
    });
};

// 保存知识库类型
export const saveType = (data) => {
    return request({
        method: 'POST',
        url: '/Knowledge/SaveKnowledgeBaseType',
        data
    });
};

// 删除知识库类型
export const delType = (params) => {
    return request({
        method: 'GET',
        url: '/Knowledge/DeleteKnowledgeBaseType',
        params
    });
};

// 获取知识库文件列表
export const getFileList = (params) => {
    return request({
        method: 'GET',
        url: '/Knowledge/GetKnowledgeFileList',
        params
    });
};

// 新增/保存知识库文件
export const saveFile = (data) => {
    return request({
        method: 'POST',
        url: '/Knowledge/SaveKnowledgeFile',
        data
    });
};

// 删除知识库文件
export const delFile = (params) => {
    return request({
        method: 'GET',
        url: '/Knowledge/DeleteKnowledgeFile',
        params
    });
};

// 上传知识库文件(支持多选)
export const uploadKnowFile = (data) => {
    return request({
        method: 'POST',
        url: '/Knowledge/UploadKnowledgeFiles',
        data
    });
};
