import request from '@/utils/request';


// 获取列表数据
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-achievement/getFjsyAchievementList',
        params
    });
};

//删除主表信息
export const delach = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-achievement/delFjsyAchievementByid',
        params
    });
};

// 根据pid查询主表详情
export const getById = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-achievement/getFjsyAchievementByid',
        params
    });
};


// 新增/编辑数据
export const saveFjsyAchievement = (data) => {
    return request({
        method: 'POST',
        url: '/fjsy-achievement/saveFjsyAchievement',
        data
    });
};

//查询文本内容列表
export const getContentList = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-text/getFjsyTextList',
        params
    });
};


// 新增/编辑数据
export const addFjsyText = (data) => {
    return request({
        method: 'POST',
        url: '/fjsy-text/addFjsyText',
        data
    });
};


//删除内容
export const delFjsyTextByid = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-text/delFjsyTextByid',
        params
    });
};

//根据pid查询详情
export const getFjsyTextByid = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-text/getFjsyTextByid',
        params
    });
};

//文件上传
export const addFjsyImgFile = (data) => {
    return request({
        method: 'POST',
        url: '/fjsy-img-file/addFjsyImgFile',
        data
    });
};

//查询文件列表
export const getFjsyImgFile = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-img-file/getFjsyImgFile',
        params
    });
};

//删除图片
export const delFile = (params) => {
    return request({
        method: 'GET',
        url: '/fjsy-img-file/delFjsyImgFile',
        params
    });
};ww
