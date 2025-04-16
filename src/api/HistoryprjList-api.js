import request from '@/utils/request';
import axios from 'axios';

// 分页获取数据
export const queryPageApi = (params) => {
    return request({
        method: 'GET',
        url: '/business/search/manage/page',
        params: params
    });
};

// 根据pid删除数据
export const delPidApi = (pid) => {
    return request({
        method: 'POST',
        url: '/business/search/manage/del/' + pid,
    });
};

// 修改数据
export const editApi = (data) => {
    return request({
        method: 'POST',
        url: '/business/search/manage/edit',
        data: data
    })
}

// 导入数据地址
export const importDataUrlApi = () => {
    return window.apiURL + "/business/search/manage/import";
}

// 根据查询条件清空数据
export const cleanApi = (params) => {
    return request({
        method: 'GET',
        url: '/business/search/manage/clean',
        params: params
    });
}

// 下载模板
export function downloadExcelApi () {
    return new Promise((resolve, reject) => {
        axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
        axios({
            method: 'get',
            url: window.apiURL + "/business/search/manage/download", // 请求地址
            responseType: 'blob', // 表明返回服务器返回的数据类型
            headers: {
                Authorization: sessionStorage.getItem("token"),
                loginType: 'system'
            }
        }).then(
            response => {
                resolve(response.data)
                let blob = new Blob([response.data], {
                    type: 'application/vnd.ms-excel'
                })
                const contentDisposition = response.headers['content-disposition']
                const match = contentDisposition.match(/filename=([^;]+)/);
                const fileName = match ? decodeURIComponent(decodeURI(match[1].trim())) : 'unknown'
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