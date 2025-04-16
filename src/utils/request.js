/*
 * @Author: WCL
 * @Date: 2021-12-06 15:59:37
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-22 15:50:15
 * @FilePath: \fjsy-web\src\utils\request.js
 * @Description: 请填写描述
 */
import axios from 'axios';
import router from '../router';
import { Message } from 'element-ui';
import DOMPurify from 'dompurify';

const request = axios.create({
    baseURL: window.apiURL,
    timeout: 0
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        const user = sessionStorage.getItem('user');
        if (user && token) {
            config.headers.auth = "system"
            config.headers.Authorization = token;
            config.headers.loginType = "system"
        }
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject();
    }
);

// 响应拦截
request.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            if (response.data.code === 200) {
                return response.data;
            } else if (response.data.code === 403) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                Message.warning("登录信息已过期，请重新登录！");
                return router.push("/")
            } else {
                Message.error(response.data.msg);
                return response.data;
            }
        } else {
            return Promise.reject();
        }
    },
    (error) => {
        const { response } = error;
        let hastoken = sessionStorage.getItem("token")
        if (hastoken != null) {
            if (error.response != null) {
                if (error.response.status != 200) {

                }
            } else {
                if (error.isAxiosError == true) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    return router.push("/");
                }
            }

            if (response == null || response == 'undefind') {
                return router.push("/");
            }
            if (response.data.code === -1) {
                Message.error(response.data.msg);
            }
        } else {
            return router.push("/"); //return Message.error(response.data.msg);
        }

        return Promise.reject();
    }
);

export default request;
