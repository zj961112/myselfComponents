import { functionsTypeList } from '@/api/common';
class TestFormData {
    constructor(params = {}) {
        this.params = params;
        return this.setDisabled();
    }
    setDisabled() {
        const obj = this.getConfig();
        for (let key in obj) {
            if (this.params.disabledKeys.includes(key) && typeof obj[key].disabled !== 'function') {
                obj[key].disabled = true;
            }
        }
        return obj;
    }
    getConfig() {
        return {
            type: {
                type: 'Select',
                value: 2,
                label: '功能类型',
                span: 8,
                sort: 1,
                selectList: functionsTypeList,
                disabled: false,
                rule: [{ required: true, message: '请选择功能类型', trigger: 'blur' }],
            },
            name: {
                type: 'Input',
                value: '',
                label: '功能名称',
                span: 8,
                sort: 2,
                disabled: () => {
                    return this.params.type !== 'add';
                },
                rule: [{ required: true, message: '请输入功能名称', trigger: 'blur' }]
            },
            code: {
                type: 'Input',
                value: '',
                defaultValue: '',
                label: '功能编码',
                span: 24,
                sort: 3,
                disabled: false,
                isSlot: true
            },
            img: {
                type: 'Upload',
                value: '',
                label: '图片上传',
                span: 24,
                sort: 4,
                disabled: false,
                showTips: true,
                size: 50,
                accept: ['jpg', 'jpeg', 'png'],
                rule: [{ required: true, message: '请上传图片', trigger: 'change' }]
            }
        }
    }
}

const treeData = [{
    id: 1, // 角色ID
    name: '数据资产研发运营VP', // 角色名称
    parentId: 0, // 父级角色ID
    deptId: 1, // 组织ID
    status: 1, // 1-启用 2-停用
    children: [{ // 子角色列表
        id: 2, //
        name: '数据资产运营总经理',
        parentId: 1,
        deptId: 2,
        status: 1, // 1-启用 2-停用          
        children: [],
        hidden: true
    }, {
        id: 3,
        name: '数据资产研发总经理',
        parentId: 1,
        deptId: 2,
        status: 1, // 1-启用 2-停用
        children: [{
            id: 4,
            name: '研发主管',
            parentId: 3,
            deptId: 3,
            status: 1, // 1-启用 2-停用
            // disabled: true,
            children: [{
                id: 5,
                name: '研发人员',
                parentId: 4,
                deptId: 4,
                status: 1, // 1-启用 2-停用
            }, {
                id: 6,
                name: '测试人员',
                parentId: 4,
                did: 4,
                status: 1, // 1-启用 2-停用
            }, {
                id: 7,
                name: '产品经理',
                parentId: 4,
                did: 4,
                status: 1, // 1-启用 2-停用
            }]
        }]
    }]
}]

export {
    TestFormData,
    treeData
}