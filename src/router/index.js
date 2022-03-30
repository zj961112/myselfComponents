/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2021-08-16 18:32:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-18 09:43:06
 */
import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), name: 'login', hidden: true, meta: { noCache: true } },
    { path: '/404', component: _import('404'), name: 'error', hidden: true },
    {
        path: '/',
        component: Layout,
        redirect: 'test',
        hidden: true,
        children: [{
            path: 'test',
            redirect: '/test/index',
            component: _import('login/index')
        }]
    },
    
    // {
    //     path: '/message',
    //     component: Layout,
    //     redirect: '/message/list',
    //     name: 'message',
    //     meta: { title: '消息管理', icon: 'example', noCache: false, new: true },
    //     children: [{
    //         path: 'list',
    //         name: 'MessageIndex',
    //         hidden: false,
    //         component: _import('messageManage/index'),
    //         meta: { title: '消息列表', icon: 'example', noCache: false, new: true }
    //     },{
    //         path: 'add',
    //         name: 'MessageAdd',
    //         hidden: true,
    //         component: _import('messageManage/add'),
    //         meta: { title: '新增消息', icon: 'example', noCache: false, new: true }
    //     },{
    //         path: 'view/id/:id',
    //         name: 'MessageView',
    //         hidden: true,
    //         component: _import('messageManage/view'),
    //         meta: { title: '消息详情', icon: 'example', noCache: false, new: true }
    //     },{
    //         path: 'update/id/:id',
    //         name: 'MessageUpdate',
    //         hidden: true,
    //         component: _import('messageManage/update'),
    //         meta: { title: '编辑详情', icon: 'example', noCache: false, new: true }
    //     }]
    // }
    // 测试
    {
        path: '/test',
        component: Layout,
        redirect: '/test/index',
        name: 'test',
        hidden: false,
        meta: { title: '测试', icon: 'example', new: true },
        children: [{
            path: 'index',
            name: 'TestIndex',
            hidden: false,
            component: _import('tinymce'),
            meta: { title: '测试', icon: 'example', new: true }
        }]
    },
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
