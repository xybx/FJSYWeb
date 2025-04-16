import request from '@/utils/request';
// 获取合规审查图层服务列表
export const getHGSCLayer = () => {
    return request({
        method: 'GET',
        url: '/HGSC/GetHGSCLayers'
    });
};
//  保存合规审查图层
export const SaveHGSCLayer = (data) => {
    return request({
        method: 'POST',
        url: '/HGSC/SaveHGSCLayer',
        data
    });
};
// 删除合规审查图层
export const DeleteHGSCLayer = (params) => {
    return request({
        method: 'GET',
        url: '/HGSC/DeleteHGSCLayer',
        params
    });
};
