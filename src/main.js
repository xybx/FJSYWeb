/*
 * @Author: WCL
 * @Date: 2021-12-06 15:59:37
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-01 14:59:35
 * @FilePath: \fjsy-web\src\main.js
 * @Description: 项目入口JS
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, {
    size: 'small'
});

import { setCookie, getCookie, delCookie } from './utils/cookie'
Vue.prototype.$cookieStore = {
    setCookie,
    getCookie,
    delCookie
}
// 拖拽
import './plugins/directives';

// 引入iconfont
import '@/assets/fonts/iconfont.css';
import '@/assets/fonts/iconfont';

// 引入富文本
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);

Vue.config.productionTip = false;

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `福建省院智慧规划平台运维端`;
    // document.title = `${to.meta.title} | 后台运维项目`;
    next();
    // const role = localStorage.getItem('ms_username');
    // if (!role && to.path !== '/login') {
    //     next('/login');
    // } else if (to.meta.permission) {
    //     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    //     role === 'admin' ? next() : next('/403');
    // } else {
    //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //             confirmButtonText: '确定'
    //         });
    //     } else {
    //         next();
    //     }
    // }
});

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
