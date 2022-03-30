// 功能类型
const functionsTypeList = [{
    code: 1,
    name: '按钮'
}, {
    code: 2,
    name: '接口'
}]

// 发送方式
const sendMethods = [{
    code: 2,
    name: '微信公众号'
}, {
    code: 3,
    name: '短信'
}, {
    code: 1,
    name: '钉钉'
}]

//状态
const statusList = [{
    code: 1,
    name: '启用'
}, {
    code: 0,
    name: '停用'
}]

//业务域
const bizDomain = [{
    code: 1,
    name: '商品域'
}, {
    code: 2,
    name: '消费者交易域'
}, {
    code: 3,
    name: '渠道交易域'
}, {
    code: 4,
    name: '营业域'
}, {
    code: 5,
    name: '客户域'
}, {
    code: 6,
    name: '渠道域'
}, {
    code: 7,
    name: '库存域'
}]

//消息状态
const messageStatus = [
    {
        code: 0,
        name: '未发送'
    },
    {
        code: 1,
        name: '已经发送'
    },
    {
        code: 2,
        name: '部分发送'
    },
    {
        code: 3,
        name: '发送失败'
    },
    {
        code: 4,
        name: '已取消'
    }
]


// 推送方式
const sendTypeList = [{
    code: 1,
    name: '定时发送'
}, {
    code: 2,
    name: '周期发送'
}]

//周期发送选择周期列表
const cycleList = [{
    code: 3,
    name: '天'
}]

export {
    bizDomain,
    functionsTypeList,
    sendMethods,
    statusList,
    messageStatus,
    sendTypeList,
    cycleList
}