import request from '@/utils/request';

// 列表展示
export function messageFindAll(params) {
    return request({
        url: '/message/findAll',
        method: 'get',
        params: params
    })
}
// 文件上传
export function messageUpload(params) {
    return request({
        url: '/message/upload',
        method: 'post',
        data: params
    })
}