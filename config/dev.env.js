var merge = require("webpack-merge");
var prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    APP_ID: 25,
    //http://test-api.taedata.com/message-center-api
    BASE_API: '"/api"', // 测试地址
    AUTH_API: '"http://test-api.taedata.com/auth-center"', // 权限中心测试地址
    USER_API: '"http://test-api.taedata.com/user-api"', // 用户中心测试地址
    LOGIN_URL: '"http://test-web.taedata.com/login-web/index.html#/login"', // 测试登录地址
})