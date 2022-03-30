import { getPermission } from '@/api/user'
import { getToken, setToken, removeToken, setUser, removeUser } from '@/utils/auth'
import { createUrlWithEncodeParams } from '@/utils/common';
const user = {
    state: {
        token: getToken(),
        userInfo: {},
        routerNames: [], // 路由 name 集合
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
            setToken(token);
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
            setUser(userInfo);
        },
        SET_ROUTER_NAMES: (state, names) => {
            state.routerNames = names;
        },
        REMOVE_TOKEN: (state) => {
            state.token = '';
            removeToken();
        },
        REMOVE_USER: (state) => {
            state.token = '';
            removeUser();
        },
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    const data = response.data;
                    commit('SET_TOKEN', data.token);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({ commit, state }, targetUrl) {
            return new Promise((resolve, reject) => {
                removeToken();
                commit('REMOVE_TOKEN');
                commit('REMOVE_USER');
                const url = targetUrl || createUrlWithEncodeParams(process.env.LOGIN_URL, {
                    ref: window.location.href
                })
                location.replace(url);
                resolve()
            })
        },

        // 获取权限
        GetPermission({ commit, state }, token) {
            return new Promise((resolve, reject) => {
                getPermission({
                    appId: process.env.APP_ID
                }).then(res => {
                    const list = res.menuList;
                    commit('SET_USERINFO', res);
                    if (list.length == 0) {
                        reject();
                    } else {
                        const names = [], tree = {};
                        list.forEach(x => {
                            const { routerName, children } = x;
                            names.push(routerName);
                            if (children.length > 0) {
                                tree[routerName] = {
                                    children: children
                                }
                                children.forEach(y => {
                                    names.push(y.routerName);
                                })
                            }
                        })
                        commit('SET_ROUTER_NAMES', names);
                        commit('SET_PERMISSION_TREE', tree);
                        resolve({ names, tree });
                    }
                }).catch(() => {
                    reject();
                })
            })
        },
    }
}

export default user
