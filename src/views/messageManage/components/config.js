import { sendMethods,messageStatus,sendTypeList } from '@/api/common';
import { FormData } from '@/utils/class';

/**
 * 详情页表单数据配置初始化
 * @class BasicInfoFormData
 * @constructor
 */
 class BasicInfoFormDataOne extends FormData {
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
            storeCode: {
                type: 'Input',
                value: '',
                label: '模版名称',
                span: 8,
                sort: 1,
                rule: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
                maxlength:20
            },
            bussiness: {
                type: 'Select',
                value: '',
                label: '关联业务域',
                span: 8,
                sort: 1,
                selectList: sendMethods
            },
            storeAuthCode: {
                type: 'Input',
                value: '',
                label: '备注',
                span: 24,
                sort: 2,
                inputType:'textarea',
                rows:3,
                maxlength:200
            }
        }
    }
}

class BasicInfoFormDataTwo extends FormData {
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
            storeCode: {
                type: 'Select',
                value: '',
                label: '发送方式',
                span: 24,
                sort: 1,
                selectList: sendMethods,
                rule: [{ required: true, message: '请选择发送方式', trigger: 'change' }],
                maxWidth:'100%'
            },
            code: {
                type: 'Input',
                value: '',
                label: '公众号模版编号',
                span: 24,
                sort: 2,
                maxWidth:'100%',
                rule: [{ required: true, message: '请输入公众号模版编号', trigger: 'blur' }],
            },
            title: {
                type: 'Input',
                value: '',
                label: '副标题',
                span: 24,
                sort: 2,
                maxWidth:'100%',
                rule: [{ required: true, message: '请输入副标题', trigger: 'blur' }],
            },
            mark: {
                type: 'Input',
                value: '',
                label: '备注',
                span: 24,
                sort: 2,
                maxWidth:'100%',
                rule: [{ required: true, message: '请输入备注', trigger: 'blur' }],
            }
        }
    }
}

// 详情页面tabs配置
const detailsTabsConfig = [{
    title: '模版消息',
    componentName: 'BasicInfo',
    prop: 'basicInfo',
}, {
    title: '',
    disabled:true
}]

// table列表配置
const sendTableColumns = [{
    prop: 'toz',
    label: '发送对象',
    width: 120
},{
    prop: 'channel',
    label: '发送方式',
    isTypecode:true,
    list:sendMethods
},{
    prop: 'state',
    label: '发送状态',
    isTypecode:true,
    list:messageStatus
}, {
    prop: 'sendTime',
    label: '发送时间',
    width: 150
}];


/**
 * 定时发送表单
 * @class TimingSendFormData
 * @constructor
 */
 class TimingSendFormData extends FormData {
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
            sendType: {
                type: 'Select',
                value: '',
                label: '推送类型',
                span: 24,
                sort: 1,
                selectList: sendTypeList,
                rule: [{ required: true, message: '请选择推送类型', trigger: 'change' }],
            },
            sendDate: {
                type: 'Input',
                value: '',
                label: '推送时间',
                span: 8,
                sort: 2,
                isSlot:true,
                hidden:false,
                // key:'sendTime',
                rule: [{ required: true, message: '请选择推送时间', trigger: 'change' }],
            },
            sendCycle: {
                type: 'Input',
                value: '',
                label: '推送时间',
                span: 8,
                isSlot:true,
                sort: 3,
                rule: [{ required: true, message: '请选择推送时间', trigger: 'change' }],
                hidden:true
            },
            sendTime: {
                type: 'Input',
                value: '',
                label: '',
                span: 8,
                sort: 4,
                hidden:false,
                isSlot:true,
                rule: [{ required: true, message: '请选择推送时间', trigger: 'change' }],
            },
        }
    }
}

export {
    BasicInfoFormDataOne,
    BasicInfoFormDataTwo,
    detailsTabsConfig,
    sendTableColumns,
    TimingSendFormData
}