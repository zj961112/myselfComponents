import request from '@/utils/request';

// 列表展示
export function messageList(params) {
    return request({
        url: '/message/list',
        method: 'get',
        params: params
    })
}
// 新增消息
export function messageAdd(params) {
    return request({
        url: '/message/add',
        method: 'post',
        data: params
    })
}

// 编辑消息
export function messageUpdate(params) {
    return request({
        url: '/message/update',
        method: 'post',
        data: params
    })
}

//查看消息详情
export function messageInfo(params) {
    return request({
        url: '/message/detail',
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

// 按条件查询消息发送结果
export function resultList(params) {
    return request({
        url: '/message/result/find',
        method: 'get',
        params: params
    })
}

//模版列表-没有分页
export function templateList(params){
    return request({
        url: '/biz/templete/findAll',
        method: 'get',
        params: params
    })
}

//取消发送
export function updateState(params){
    return request({
        url: '/message/updateState',
        method: 'POST',
        data: params
    })
}