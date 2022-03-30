import request from '@/utils/request';

// 列表展示
export function messageFormatList(params) {
    return request({
        url: '/biz/templete/list',
        method: 'get',
        params: params
    })
}
// 新增模版
export function messageFormatAdd(params) {
    return request({
        url: '/biz/templete/add',
        method: 'post',
        data: params
    })
}

// 编辑模版
export function messageFormatUpdate(params) {
    return request({
        url: '/biz/templete/update',
        method: 'post',
        data: params
    })
}

//查看模版详情
export function messageFormatInfo(params) {
    return request({
        url: '/biz/templete/find',
        method: 'get',
        params: params
    })
}

//查看模版详情
export function channelFormatInfo(params) {
    return request({
        url: '/biz/templete/findChannelMessageTemplate',
        method: 'get',
        params: params
    })
}

// 获取板式列表-没有分页
export function formatList(params) {
    return request({
        url: '/channel/templete/findAll',
        method: 'get',
        params: params
    })
}