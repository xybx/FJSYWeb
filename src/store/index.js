/*
 * @Author: WCL
 * @Date: 2021-12-09 15:54:33
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-07 09:28:41
 * @FilePath: \admin-service\src\store\index.js
 * @Description: 请填写描述
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        // 登录token
        token: '',
        // 一张图保存
        isSave:false,
        //是否是管理员角色
        isAdmin:false,
    },
    mutations: {
        // 获取token
        getToken() {},
        // 设置token
        setToken(state, token) {
            state.token = token;
        },
        IS_SAVE(state,payload){
            state.isSave=payload;
        },
        setIsAdmin(state,isAdmin){
            state.isAdmin=isAdmin
        }
    },
    actions: {},
    modules: {}
});
