<template>
    <div>
        <!-- 基础表单组件测试 -->
        <!-- <BaseForm ref="form" :form="formData" labelWidth="200" title="菜单详情" @submit="handleSubmit">
            <div slot="form-code">
                11
            </div>
        </BaseForm> -->
        <!-- 基础树结构测试 -->
        <el-input v-model="treeConfig.filterText" placeholder="请输入ID或名称" clearable style="width: 200px;margin-left: 50px;margin-top: 20px;"></el-input>
        <BaseTree :data="treeData" :config="treeConfig" :filterMethod="filterMethod" :refs="$refs" style="width: 400px">
            <span slot="operation" slot-scope="scope" @click.stop="handleClick(scope)">
                <span>上移</span>
                <span>下移</span>
            </span>
        </BaseTree>
        <el-button @click="test">测试</el-button>
        <el-button @click="test2">测试2</el-button>
    </div>
</template>
<script>
import BaseForm from '@/components/BaseForm';
import BaseTree from '@/components/BaseTree';
import { TestFormData, treeData } from './config';
import { flattenObject, flattenObjectArray } from '@/utils/formatter';
export default {
    name: 'test',
    components: {
        BaseForm,
        BaseTree
    },
    data() {
        return {
            formData: {}, // 表单数据
            treeData: [], // 树组件数据
            treeConfig: {}, // 树组件配置
        }
    },
    created() {
        this.initData();
    },
    methods: {
        /**
         * 初始化数据
         */
        initData() {
            this.formData = Object.assign({}, new TestFormData({ type: 'add', disabledKeys: ['type', 'name'] }));
            this.treeData = JSON.parse(JSON.stringify(treeData));
            this.treeConfig = {
                // showFilter: true,
                showCheckbox: true,
                defaultExpandAll: true,
                // currentNodeKey: 3,
                // defaultExpandedKeys: [3],
                // defaultCheckedKeys: [3],
                filterText: '',
            }
            // setTimeout(() => {
            //     this.treeConfig.filterText = '测试';
            // }, 1000)
        },
        /**
         * 提交表单
         */
        handleSubmit() {

        },
        /**
         * 测试
         */
        test() {
            // this.$refs.form.$refs.BaseForm.validate(valid => {
            //     if (valid) {
            //         console.log('valid');
            //     } else {
            //         console.log('reject');
            //     }
            // })
            console.log(this.$refs.BaseTree.getCheckedNodes(false, true))
            // console.log(flattenObjectArray(this.$refs.BaseTree.getCheckedNodes(false, true), 'id'))
            this.$refs.BaseTree.setCheckedKeys([1, 2, 3, 4, 5, 6, 7]);
        },
        test2() {
            this.$refs.BaseTree.setCheckedKeys([]);

        },
        /**
         * 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
         * @params {string} value 过滤的目标值
         * @params {object} data 节点的数据对象
         * @params {string} node 节点的所有属性对象，包含 data 及 isCurrent 等值
         */
        filterMethod(value, data, node) {
            const { filterText } = this.treeConfig;
            return filterText == data.id || filterText == data.name;
        },
        /**
         * 点击按钮
         */
        handleClick(scope) {
            console.log(scope)
        }
    }
}
</script>