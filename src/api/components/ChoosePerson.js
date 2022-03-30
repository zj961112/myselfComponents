import request from '@/utils/request';
/**
 * @description 查询---通过组织或者搜索选人
 * @param params
 * @returns {*}
 */
export function getQueryUser(params) {
    return request({
        url: `${process.env.USER_API}/user/select`,
        method: 'GET',
        params: params
    })
}

/**
 * @description: 查询---组织树信息（包含用户）
 * @param {id,type}
 * @return {*}
 */
export function getOrgUserTree(params) {
    return request({
        url: `${process.env.USER_API}/org/tree/user`,
        method: 'GET',
        params: params
    })
}

/**
 * @description 查询---根据用户ID分页查询 用户信息
 * @param params
 * @returns {*}
 */
export function getUserListByIds(params) {
    return request({
        url: `${process.env.USER_API}/user/list/ids/page`,
        method: 'POST',
        data: params
    })
}
