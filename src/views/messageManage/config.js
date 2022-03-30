import { FormData } from '@/utils/class';
import { sendMethods,statusList,messageStatus } from '@/api/common';
// 商品列表页筛选条件配置
const goodsListFilter = {
    title: {
        type: 'sInput',
        value: '',
        label: '消息标题',
        sort: 1,
    },
    channel: {
        type: 'sSelect',
        value: '',
        label: '发送方式',
        selectList: sendMethods,
        sort: 2,
    },
    state: {
        type: 'sSelect',
        value: '',
        label: '状态',
        selectList: messageStatus,
        sort: 3,
    },
    bizTemplateId: {
        type: 'sSelect',
        value: '',
        label: '应用模版',
        selectList: [],
        sort: 4,
        optionKey:'id',
        optionLabel:'name',
        optionValue:'id'
    },
    createUser: {
        type: 'sInput',
        value: '',
        label: '创建人',
        sort: 5,
    },
    datetime: {
        type: 'sDate',
        dateType: 'daterange',
        value: [],
        label: '推送时间',
        sort: 6,
        defaultValue: []
    }
}

// table列表配置
const goodsListTableColumns = [{
    prop: 'title',
    label: '消息标题',
},{
    prop: 'channel',
    label: '发送方式',
    isTypecode:true,
    list:sendMethods,
    isMultiple:true,
    width: 100
},{
    prop: 'bizTemplateId',
    label: '应用模版',
    isTypecode:true,
    list:[],
    codeKey:'id',
    nameKey:'name',
    isMultiple:true
}, {
    prop: 'state',
    label: '发送状态',
    isTypecode:true,
    list:messageStatus,
    width: 80
}, {
    prop: 'createUser',
    label: '创建人员',
}, {
    prop: 'sendTime',
    label: '推送时间',
    width: 200
},{
    prop: 'operation',
    label: '操作',
    isSlot: true,
    fixed: 'right',
    width: 220
}];


// 详情页面tabs配置
const detailsTabsConfig = [{
    title: '基本信息',
    componentName: 'BasicInfo',
    prop: 'basicInfo',
    disabled: false,
}, {
    title: '商品信息',
    componentName: 'GoodsInfo',
    prop: 'goodsInfo',
    disabled: true,
}, {
    title: '茶叶信息',
    componentName: 'TeaInfo',
    prop: 'teaInfo',
    disabled: true,
}]
/**
 * 列表表单数据配置初始化
 * @class ListGoodsFormData
 * @constructor
 */
 class ListFormData extends FormData {
    constructor(params) {
        super(params);
        return this.initData(this.getConfig());
    }
    /**
     * 获取配置信息
     * @returns 返回初始配置信息
     */
    getConfig() {
        return {
            addType: {
                type: 'Select',
                value: '',
                label: '新增消息方式',
                span: 24,
                sort: 1, 
                selectList: [{
                    code:1,
                    name:'模版消息'
                },
                // {
                //     code:2,
                //     name:'自定义消息'
                // }
            ],
                rule: [{ required: true, message: '请选择新增消息方式', trigger: 'change' }],
            }
        }
    }
}

export {
    goodsListFilter,
    goodsListTableColumns,
    detailsTabsConfig,
    ListFormData
}