import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'
import { removeEmptyProps } from '@/utils/common';
const { $message: Message } = window.Vue.prototype

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    // timeout: 15000 // 请求超时时间,
    withCredentials: false
})

// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token || getToken()) {
        config.headers['token'] = getToken() // 让每个请求携带自定义 token 请根据实际情况自行修改
        config.headers['appId'] = process.env.APP_ID; // 设置应用 ID
    }
    // 对params执行
    if (config.method === 'get' && config.params) {
        config.params = removeEmptyProps(config.params);
    }
    if ((config.method === 'post' || config.method === 'put') && config.dataType !== 'json') {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data;
        if (res.successed == false) {
            Message({
                message: res.errorDesc || '系统错误',
                type: 'error',
                duration: 2 * 1000
            })
            if (res.errorCode == 401) {
                store.dispatch('LogOut');
            }
            return Promise.reject('error')
        } else {
            return response.data.returnValue;
        }
    },
    error => {
        const { data } = error.response;
        const { errorCode, errorDesc } = data || {};
        Message({
            message: errorDesc || '系统错误',
            type: 'error',
            duration: 2 * 1000
        })
        if (errorCode == 401) {
            store.dispatch('LogOut');
        }
        return Promise.reject(error)
    }
)

export default service
