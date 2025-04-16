import request from '@/utils/request';

// 删除数据
export const queryPageApi = (params) => {
    return request({
        method: 'GET',
        url: '/online/log/manage/page',
        params
    });
}