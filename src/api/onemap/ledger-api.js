import request from '@/utils/request';
// 获取统计台账分组列表
export const getGroupList = (params) => {
    return request({
        method: 'GET',
        url: '/TJTZ/GetGroupList',
        params
    });
};
// 保存分组
export const saveGroup=(data)=>{
    return request({
        method:'POST',
        url:'/TJTZ/SaveGroup',
        data
    })
    
}
// 删除分组
export const DeleteGroup = (params) => {
    return request({
        method: 'GET',
        url: '/TJTZ/DeleteGroup',
        params
    });
};
// 获取统计台账图层列表
export const getLayerList = (params) => {
    return request({
        method: 'GET',
        url: '/TJTZ/getLayerList',
        params
    });
};
// 保存图层
export const saveLayer=(data)=>{
    return request({
        method:'POST',
        url:'/TJTZ/SaveLayer',
        data
    })
    
}
// 删除图层
export const DeleteLayer = (params) => {
    return request({
        method: 'GET',
        url: '/TJTZ/DeleteLayer',
        params
    });
};
// 获取对应的字段列表
export const  getServerLayerFields= (params) => {
    return request({
        method: 'GET',
        url: '/Condition/GetServerLayerFields',
        params
    });
};
