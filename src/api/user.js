import request from '@/utils/request';

/**
 * 获取 token 是否过期
 * @param {*} params 
 * @returns 
 */
export function getTokenAlive(params) {
	return request({
		url: `${process.env.AUTH_API}/alive`,
		method: 'POST',
		data: params
	})
}

/**
 * 获取账号详情
 */ 
export function getPermission(params) {
    return request({
		url: `${process.env.AUTH_API}/menus/auth/user/list`,
        method: 'GET',
        params: params
    })
}