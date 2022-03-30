let env = { NODE_ENV: `"${process.env.NODE_ENV}"` };

env.APP_ID = {
    test: 25,
    production: 41
} [process.env.NODE_ENV];

env.BASE_API = {
    test: '"http://test-api.taedata.com/message-center-api"',
    production: '"https://api.taedata.com/message-center-api"',
} [process.env.NODE_ENV];

env.AUTH_API = {
    test: '"http://test-api.taedata.com/auth-center"',
    production: '"https://api.taedata.com/auth-center-api"',
} [process.env.NODE_ENV];

env.USER_API = {
    test: '"http://test-api.taedata.com/user-api"',
    production: '"https://api.taedata.com/user-api"',
} [process.env.NODE_ENV];

env.LOGIN_URL = {
    test: '"http://test-web.taedata.com/login-web/index.html#/login"',
    production: '"https://web.taeteadata.com/#/login"'
} [process.env.NODE_ENV];

module.exports = env;
