/*
 * @Author: WCL
 * @Date: 2022-01-25 10:58:18
 * @LastEditors: LJX
 * @LastEditTime: 2022-05-16 16:50:09
 * @FilePath: \admin-service\src\api\mapservice-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

// 获取树状结构
export const selectByModelCode = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree/selectByModelCode',
        params
    });
};

// 新增模块
export const addModole = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree/add',
        data
    });
};

// 修改模块
export const updateModole = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree/update',
        data
    });
};


// 删除模块
export const delModole = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree/del',
        data
    });
};

//根据模块id获取图层列表
export const getByModelTreeId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer/getByModelTreeId',
        params
    });
}

//添加图层
export const addLayer = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer/add',
        data
    });
};

//修改图层
export const updateLayer = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer/update',
        data
    });
};

// 删除图层
export const delLayer = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer/del',
        data
    });
};


//根据图层id获取查询字段配置列表
export const getSearchListByLayerId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer-search/selectByLayerId',
        params
    });
}

//根据图层id获取展示字段配置列表
export const getShowListByLayerId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer-show/selectByLayerId',
        params
    });
}

//根据图层id获取对应的数据库字段列表
export const getDbListByLayerId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer/getFieldsByLayerId',
        params
    });
}

//根据code获取字典
export const getDictByCode = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree/selectDictByCode',
        params
    });
}

//根据父级id获取字典
export const getDictByParentId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree/selectDictByParentId',
        params
    });
}


//保存查询字段配置
export const saveSearch = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-search/add',
        data
    });
}
//修改查询字段配置
export const updateSearch = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-search/update',
        data
    });
}

//删除查询字段配置
export const delSearch = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-search/del',
        data
    });
}
//保存展示字段配置
export const saveShow = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-show/add',
        data
    });
}

//修改展示字段配置
export const updateShow = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-show/update',
        data
    });
}

//删除展示字段配置
export const delShow = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-show/del',
        data
    });
}

//根据服务（模块id）获取对应的公式列表
export const getFormulaListByTreeId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-formula/getByModelTreeId',
        params
    });
}

//根据公式id获取对应的公式信息
export const getFormulaConfigByPid = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-formula/getFormulaConfigByPid',
        params
    });
}

//保存公式配置
export const addOrUpdateFormula = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula/addOrUpdateFormula',
        data
    });
}

// 根据传入的模块id获取对应的图层以及图层对应的数据库字段
export const getLayerAndFieldsByModelTreeId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer/getLayerAndFieldsByModelTreeId',
        params
    });
}


//删除公式
export const delFormula = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula/del',
        data
    });
}

//根据公式id获取公式查询字段配置列表
export const getFormulaSearchListByFormulaId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-formula-search/getByFormulaIdOld',
        params
    });
}

//根据公式id获取公式展示字段配置列表
export const getFormulaShowListByFormulaId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-formula-show/selectByFormulaId',
        params
    });
}

//保存公式查询字段配置
export const saveFormulaSearch = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-search/add',
        data
    });
}

//修改公式查询字段配置
export const updateFormulaSearch = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-search/update',
        data
    });
}

//删除公式查询字段配置
export const delFormulaSearch = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-search/del',
        data
    });
}

//保存公式展示字段配置
export const saveFormulaShow = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-show/add',
        data
    });
}

//修改公式展示字段配置
export const updateFormulaShow = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-show/update',
        data
    });
}

//删除公式展示字段配置
export const delFormulaShow = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-show/del',
        data
    });
}

//根据传入的查询字段id获取对应的下拉列表数据
export const getOptionsByFieldIdSearch = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer-search-options/getOptionsByFieldId',
        params
    });
}
//保存查询字段下拉列表数据
export const saveSearchOptions = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-search-options/add',
        data
    });
}

//修改查询字段下拉列表数据
export const updateSearchOptions = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-search-options/update',
        data
    });
}

//删除查询字段下拉列表数据
export const delSearchOptions = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-search-options/del',
        data
    });
}

//根据公式查询条件id获取下拉列表
export const getOptionsByFieldIdFormulaSearch = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-formula-search-options/getBySearchId',
        params
    });
}

//保存公式查询字段下拉列表数据
export const saveFormulaSearchOptions = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-search-options/add',
        data
    });
}

//修改公式查询字段下拉列表数据
export const updateFormulaSearchOptions = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-search-options/update',
        data
    });
}


//删除公式查询字段下拉列表数据
export const delFormulaSearchOptions = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-formula-search-options/del',
        data
    });
}


//获取所有图层及字段信息
export const getAllLayerAndFields = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer/getAllLayersFields',
        params
    });
}


//根据公式id获取图层字段
export const getAllLayersFieldsByFormulaId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer/getAllLayersFieldsByFormulaId',
        params
    });
}


//获取服务类型接口
export const getServerType = (params) => {
    return request({
        method: 'GET',
        url: '/MapServer/GetMapKinds',
        params
    });
}

//根据图层id获取展示字段配置列表
export const getStatisticsListByLayerId = (params) => {
    return request({
        method: 'GET',
        url: '/figure-model-tree-layer-statistics/selectByLayerId',
        params
    });
}

//保存统计字段配置
export const saveStatistics = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-statistics/add',
        data
    });
}

//修改统计字段配置
export const updateStatistics = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-statistics/update',
        data
    });
}

//删除统计字段配置
export const delStatistics = (data) => {
    return request({
        method: 'POST',
        url: '/figure-model-tree-layer-statistics/del',
        data
    });
}