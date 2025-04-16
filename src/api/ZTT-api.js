import request from '@/utils/request';
// 获取专题图图层服务列表
export const getZTTLayers =()=>{
    return request({
        method:'GET',
        url:'/ZTT/GetZTTLayers',
    })
}
// 保存专题图层
export const SaveZTTLayer = (data) => {
    return request({
        method: 'POST',
        url: '/ZTT/SaveZTTLayer',
        data
    });
};
// 删除专题图图层
export const DeleteZTTLayer = (params) => {
    return request({
        method: 'GET',
        url: '/ZTT/DeleteZTTLayer',
        params
    });
};
