import router from './router'
import store from './store'
import { getToken, setToken } from '@/utils/auth' // 验权
import { getParamFromUrl, createUrlWithEncodeParams } from '@/utils/common';
let { $message: Message } = window.Vue.prototype


const whiteList = ['login', 'error'] // 不重定向白名单

const token = getParamFromUrl('token') || getToken();
if (token) {
    setToken(token);
}
login(token);

function login(token) {
    if (token) {
        store.dispatch('GetPermission', token).then(res => {
            const { names, tree } = res;
            router.options.routes.forEach((route) => {
                if (!tree[route.name]) {
                    return;
                }
                route.redirect = `${route.path}/${tree[route.name].children[0].url}`;
            })
            router.beforeEach((to, from, next) => {
                if (whiteList.indexOf(to.name) > -1) {
                    next();
                } else {
                    if (names.indexOf(to.name) == -1) {
                        //到时候上线需要改成原来的样子
                        Message({
                            message: '您没有权限进入该页面',
                            type: 'warning'
                        })
                        // next();
                    } else {
                        next();
                    }
                }
            })
        })
    } else {
        store.dispatch('LogOut');
    }
}
