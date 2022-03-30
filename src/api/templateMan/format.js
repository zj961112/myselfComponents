import request from '@/utils/request';

// 列表展示
export function templeteList(params) {
    return request({
        url: '/channel/templete/list',
        method: 'get',
        params: params
    })
}

// 新增版式
export function templeteAdd(params) {
    return request({
        url: '/channel/templete/add',
        method: 'post',
        data: params
    })
}

// 编辑版式
export function templeteUpdate(params) {
    return request({
        url: '/channel/templete/update',
        method: 'post',
        data: params
    })
}

//查看板式详情
export function templeteInfo(params) {
    return request({
        url: '/channel/templete/find',
        method: 'get',
        params: params
    })
}