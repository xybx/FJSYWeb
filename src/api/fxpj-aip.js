import request from '@/utils/request';
// 获取分析评价类型列表
export const getFXPJTypeList = ()=>{
    return request({
        method:'GET',
        url:'/FXPJ/GetFXPJTypeList',
    })
}