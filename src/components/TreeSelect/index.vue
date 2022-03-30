<template>
    <div id="TreeSelect">
        <el-tooltip :disabled="!showTooltip" class="item" effect="dark" :content="selectedData" placement="top-start">
            <el-select 
                ref="TreeSelect"
                v-model="selectedData"
                :value-key="nodeKey"
                :multiple="multiple" 
                :style="selectStyle" 
                filterable
                :filter-method="handleSelectFilter"
                :collapse-tags="collapseTag"
                :reserve-keyword="true"
                popper-class="tree-select"
                @visible-change="handleVisibleChange"
                @clear="clearSelect"
                :disabled="disabled"
                :clearable="clearable">
                <el-option>
                    <BaseTree 
                        :data="treeData" 
                        :config="treeConfig" 
                        :refs="$refs" 
                        :style="treeStyle" 
                        @handleNodeClick="handleNodeClick"
                        @handleCheckChange="handleCheckChange">
                    </BaseTree>
                </el-option>
            </el-select>
        </el-tooltip>
    </div>
</template>
<script>
import BaseTree from '@/components/BaseTree';
import { differenceArray, flattenObjectArray } from '@/utils/formatter';
export default {
    name: 'TreeSelect',
    components: {
        BaseTree
    },
    props: {
        // tree 组件源数据
        treeData: {
            type: Object,
            default() { }
        },
        // tree 组件配置，同 BaseTree config
        treeConfig: {
            type: Object,
            default() { }
        },
        /**
         * <object> select 配置表
         * multiple <boolean> 是否多选
         * showParents <boolean> 是否显示父级
         * collapseLimit <number> 多选时进行折叠的界限数量
         * width <number> 宽度
         * height <number> 高度
         * showKey <boolean> 是否显示 key 值
         * disabled <boolean> 是否禁用选项
         * clearable <boolean> 是否允许清空
         */
        selectConfig: {
            type: Object,
            default() { }
        },
    },
    data() {
        return {
            checkedData: [], // 下拉选项
            selectedData: [], // 选中的节点
            selectedKey: null, // 当前选中的节点 key
        }
    },
    computed: {
        /**
         * 宽度
         */
        width() {
            return this.selectConfig.width || 250;
        },
        /**
         * 高度
         */
        height() {
            return this.selectConfig.height || 300;
        },
        /**
         * 树结构的 style
         */
        treeStyle() {
            return `width: ${this.width}px;height: ${this.height - 30}px;padding: 0;`;
        },
        /**
         * 下拉框的 style
         */
        selectStyle() {
            return `width: ${this.width}px;`
        },
        /**
         * 树结构的节点 key
         */
        nodeKey() {
            return this.treeConfig.nodeKey || 'id';
        },
        /**
         * 树结构的节点 label
         */
        nodeLabel() {
            return this.treeConfig.label || 'name';
        },
        /**
         * 多选时是否将选中值按文字的形式展示
         */
        collapseTag() {
            return this.selectedData.length > (this.selectConfig.collapseLimit || 5);
        },
        /**
         * 是否多选，默认 false
         */
        multiple() {
            return Boolean(this.selectConfig.multiple);
        },
        /**
         * 是否展示父级元素的值
         */
        showParents() {
            return Boolean(this.selectConfig.showParents);
        },
        /**
         * 是否显示 key 值
         */
        showKey() {
            return this.multiple || Boolean(this.selectConfig.showKey);
        },
        /**
         * 是否禁用选项
         */
        disabled() {
            return Boolean(this.selectConfig.disabled);
        },
        /**
         * 是否可清除
         */
        clearable() {
            return this.selectConfig.clearable === false ? false : true;
        },
        /**
         * 是否展示 tooltip
         */
		showTooltip() {
			const { showTooltip, tooltipLimit } = this.selectConfig;
			return showTooltip && this.selectedData && this.selectedData.length > (tooltipLimit || 20);
		}
    },
    watch: {
        /**
         * 深度监听 selectedData 数据前后变化
         */
        selectedData: {
            handler(value, oldValue) {
                // 当选中的项发生减少时触发，此处主要为 tag 删除及 select 被 clear 时触发
                if (this.multiple && value.length < oldValue.length) {
                    // 获取变化的项
                    const diff = differenceArray(oldValue, value);
                    // 遍历减少 checkedData 内对应的项
                    diff.forEach(item => {
                        const key = item.split('-')[0];
                        const index = this.checkedData.findIndex(i => i[this.nodeKey] == key);
                        if (index > -1) {
                            this.checkedData.splice(index, 1);
                        }
                    })
                    // 根据当前 checked
                    this.$refs.BaseTree.setCheckedKeys(flattenObjectArray(this.checkedData, this.nodeKey));
                }
            },
            deep: true
        }
    },
    created() {
        // 开启多选时，开启树结构的严格遵循父子不关联
        this.treeConfig.checkStrictly = Boolean(this.multiple);
        // 开启多选时，强制展示树结构的 checkbox
        this.treeConfig.showCheckbox = Boolean(this.multiple);
    },
    mounted() {
        // 初始化数据
        this.$nextTick(() => {
            this.initData();
        })
    },
    methods: {
        /**
         * 初始化数据
         */
        initData() {
            const { defaultCheckedKeys, currentNodeKey } = this.treeConfig;
            if (this.multiple) { // 多选时设置初始选中和展示数据
                if (defaultCheckedKeys) {
                    defaultCheckedKeys.forEach(item => {
                        const node = this.$refs.BaseTree.getNode(item);
                        if (node) {
                            this.checkedData.push(node.data);
                            this.selectedData.push(this.getNodeLabel(node));
                        }
                    })
                }
            } else { // 单选时设置当前选中值
                if (currentNodeKey) {
                    const node = this.$refs.BaseTree.getNode(currentNodeKey);
                    if (node) {
                        this.checkedData.push(node.data);
                        this.selectedData = this.getNodeLabel(node);
                        this.selectedKey = node.data[this.nodeKey];
                    }
                }
            }
        },
        /**
         * 节点被点击时的回调，返回被点击的节点数据
         */
        handleNodeClick(data, node) {
            if (!this.multiple) {
                this.selectedData = this.getNodeLabel(node);
                this.selectedKey = data[this.nodeKey];
                this.$refs.TreeSelect.blur();
                this.$emit('handleChecked', { key: this.selectedKey, label: this.selectedData }, data);
            }
        },
        /**
         * 节点选中状态发生变化时的回调
         */
        handleCheckChange(data, checked) {
            if (checked) {
                this.checkedData.push(data);
            } else {
                const index = this.checkedData.findIndex(item => item[this.nodeKey] === data[this.nodeKey]);
                if (index > -1) {
                    this.checkedData.splice(index, 1);
                }
            }
            this.selectedData = this.checkedData.map((item) => {
                const node = this.$refs.BaseTree.getNode(item);
                return this.getNodeLabel(node);
            });
            this.$emit('handleChecked', this.selectedData, data);
        },
        /**
         * 监听下拉筛选值变化
         */
        handleSelectFilter(value) {
            this.treeConfig.filterText = value;
        },
        /**
         * 递归获取父节点的值
         * @params {object} node 当前节点
         * @params {string} prop 取的值的 prop
         * @params {string} result 当前已拼接的内容
         */
        getParentNames(node, result = '') {
            if (node.parent) {
                result = `${node.data[this.nodeLabel]}${result ? '/' + result : ''}`;
                return this.getParentNames(node.parent, result);
            } else {
                return result;
            }
        },
        /**
         * 监听下拉框显示与隐藏，发生变化时清空当前筛选项
         */
        handleVisibleChange() {
            this.treeConfig.filterText = '';
        },
        /**
         * 获取节点名称
         */
        getNodeLabel(node) {
            return this.showParents ? this.getParentNames(node) : this.showKey ? `${node.data[this.nodeKey]}-${node.data[this.nodeLabel]}` : `${node.data[this.nodeLabel]}`;
        },
        /**
         * 返回选中数据的 keys
         */
        getSelectKeys() {
            if (this.multiple) {
                return this.selectedData.map(item => {
                    return item.split('-')[0];
                })
            } else {
                return this.showKey ? this.selectedData.split('-')[0] : this.selectedKey;
            }
        },
        /**
         * 清空选项
         */
        clearSelect() {
            this.selectedData = [];
            this.selectedKey = null;
        },
    }
}
</script>
<style lang="scss">
#TreeSelect {
    .el-select {
        display: block;
    }
}
.tree-select {
    .el-select-dropdown__item {
        padding: 0;
        height: auto;
        background-color: white;
    }
    &.is-multiple {
        .el-select-dropdown__item {
            padding-right: 0;
        }
    }
    .el-tree {
        height: 100%;
        overflow: scroll;
    }
}
</style>