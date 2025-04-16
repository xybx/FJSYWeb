import request from '@/utils/request';
import axios from 'axios';


// 获取数据列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/cityQualityPromote/manage/page',
        params: params
    });
};

// 获取数据列表
export const getFileList = (params) => {
    return request({
        method: 'GET',
        url: '/cityQualityPromote/file/manage/list',
        params: params
    });
};

// 删除文件数据
export const delFile = (id) => {
    return request({
        method: 'POST',
        url: '/cityQualityPromote/file/manage/del/' + id
    });
};

// 保存历史项目数据列表
export const save = (form) => {
    return request({
        method: 'POST',
        url: '/cityQualityPromote/manage/save',
        data: form
    });
};

// 获取有数据的年份
export const yearList = () => {
    return request({
        method: 'GET',
        url: '/cityQualityPromote/manage/year'
    });
};

// 删除数据
export const del = (id) => {
    return request({
        method: 'POST',
        url: '/cityQualityPromote/manage/del/' + id
    });
};

// 导入数据地址
export const importDataUrl = () => {
    return request.baseURL + '/cityQualityPromote/manage/import';
};

// 编辑数据
export const editEntity = (editData) => {
    return request({
        method: 'POST',
        url: '/cityQualityPromote/manage/edit',
        data: editData
    });
};

// 清空所有数据
export const clearData = (year) => {
    return request({
        method: 'POST',
        url: '/cityQualityPromote/manage/clear/' + year
    });
};

// 下载模板
export function exportExcel(url, token = {}) {
    return new Promise((resolve, reject) => {
        axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8';
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
                resolve(response.data);
                let blob = new Blob([response.data], {
                    type: 'application/vnd.ms-excel'
                });
                let fileName = '导入城市建设品质提升数据模板.xlsx';
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    //释放内存
                    window.URL.revokeObjectURL(link.href);
                }
            },
            err => {
                reject(err);
            }
        );
    });
}

// 下载模板
export function download(url, fileName, token = {}) {
    return new Promise((resolve, reject) => {
        axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8';
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
                resolve(response.data);
                let blob = new Blob([response.data], {
                    type: 'application/octet-stream;charset=UTF-8'
                });
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob);
                } else {
                    var link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    //释放内存
                    window.URL.revokeObjectURL(link.href);
                }
            },
            err => {
                reject(err);
            }
        );
    });
}

// 下载模板地址
export const downloadImportTemplate = () => {
    return window.apiURL + '/cityQualityPromote/manage/download/template';
};

// 下载文件地址
export const downloadFile = (pid) => {
    return window.apiURL + '/cityQualityPromote/file/download/' + pid;
};


export const suffixList = () => {
    return request({
        method: 'GET',
        url: '/cityQualityPromote/file/allow/list'
    });
};


export const suffixDel = (id) => {
    return request({
        method: 'POST',
        url: '/cityQualityPromote/file/allow/del/' + id
    });
};

export const suffixAdd = (data) => {
    return request({
        method: 'POST',
        url: '/cityQualityPromote/file/allow',
        data
    });
};