import request from '@/utils/request';
// 文件上传
export const  uploadfile = (data) => {
    return request({
        method: 'POST',
        url: '/Upload/uploadfile',
        data
    });
};