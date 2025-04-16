/*
 * @Author: WCL
 * @Date: 2022-01-24 10:24:01
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-25 13:20:57
 * @FilePath: \fjsy-web\src\api\login-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

// 获取部门列表
export const getAllDepts = () => {
    return request({
        method: 'GET',
        url: '/login/deptList'
    });
};

// 获取人员列表
export const getAllPersons = (params) => {
    return request({
        method: 'GET',
        url: '/login/userList',
        params
    });
};

// 登录接口
export const login = (data) => {
    return request({
        method: 'POST',
        url: '/login/login/pid',
        data
    });
};

//退出登录
export const logout = () => {
    return request({
        method: 'GET',
        url: '/login/logout',
    });
};

// 获取验证码
export const getVcCode = (uid) => {
    return request({
        method: 'GET',
        url: '/login/' + uid
    })
}