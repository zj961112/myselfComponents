<template>
    <div id="BaseTree">
        <el-input class="filter-input" v-model="config.filterText" :placeholder="filterPlaceholder" :style="filterStyle" v-if="config.showFilter"></el-input>             
        <el-tree 
            :ref="ref"
            :data="data" 
            :props="defaultProps" 
            :node-key="nodeKey"
            :default-expand-all="defaultExpandAll"
            :default-expanded-keys="defaultExpandedKeys"
            :show-checkbox="showCheckbox"
            :check-strictly="checkStrictly"
            :check-on-click-node="checkOnClickNode"
            :default-checked-keys="defaultCheckedKeys"
            :current-node-key="currentNodeKey"
            :highlight-current="highlightCurrent"
            :filter-node-method="filterNodeMethod"
            :draggable="draggable"
            :allow-drag="allowDrag"
            :style="treeStyle"
            :expand-on-click-node="expandOnClickNode"
            @node-click="handleNodeClick"
            @check="handleCheck"
            @check-change="handleCheckChange">
            <span class="custom-tree-node" :class="{ 'disabled': data.disabled && !monitorNodeClick }" slot-scope="{ node, data }">
                <el-tooltip :disabled="!showTooltip(data)" class="el-tip" effect="dark" :content=" data[defaultProps.label]" placement="top-start">
                    <span>{{ data[defaultProps.label] }}</span>
                </el-tooltip>    
                <span>
                    <slot name="operation" :node="node" :data="data"></slot>
                </span>
            </span>
        </el-tree>
    </div>
</template>
<script>
export default {
    name: 'BaseTree',
    props: {
        /**
         * <Array> 源数据
         */
        data: {
            type: Array,
            default() {}
        },
        /**
         * <Object> 配置信息表
         * label <string, function(data, node)> 指定节点标签为节点对象的某个属性值，初始值为 name
         * children <string> 指定子树为节点对象的某个属性值，初始值为 children
         * disabled <boolean, function(data, node)> 指定节点选择框是否禁用为节点对象的某个属性值
         * isLeaf <boolean, function(data, node)> 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
         * nodeKey <string> 每个树节点用来作为唯一标识的属性
         * defaultExpandAll <boolean> 是否默认展开全部树
         * defaultExpandedKeys <array> 默认展开的节点的 key 的数组
         * showCheckbox <boolean> 节点是否可被选择
         * checkStrictly <boolean> 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
         * checkOnClickNode <boolean> 是否在点击节点的时候选中节点
         * defaultCheckedKeys <array> 默认勾选的节点的 key 的数组
         * currentNodeKey <string, number> 当前选中的节点
         * highlightCurrent <boolean> 是否高亮当前选中节点
         * showFilter <boolean> 是否展示 filter 输入框
         * filterText <string> 对树节点进行筛选操作
         * filterPlaceholder <string> filter 输入框的 placeholder
         * filterStyle <object> filter 输入框的 style 对象
         * draggable <boolean> 是否开启拖拽节点功能
         * treeStyle <object> 树结构底层基础样式
         * expandOnClickNode <boolean> 是否在点击节点的时候展开或者收缩节点
         * monitorNodeClick <boolean> 是否监听节点被点击
         * showTooltip <boolean> 是否展示 tooltip
         * tooltipLimit <number> tooltip 长度限制
         */
        config: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * config.filterText 有变化时触发
         */
        filterMethod: {
            type: Function,
            default: null
        },
        /**
         * 序号
         */
        index: {
            type: Number,
            default: 0
        },
        /**
         * refs 对象
         */
        refs: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    watch: {
        'config.filterText'(value) {
            this.$refs[this.ref].filter(value);
        }
    },
    computed: {
        /**
         * ref 的值
         * 当 index 为 0 时返回 BaseTree，否则返回 BaseTree-{index}，以确保多个组件时 ref 不重复
         */
        ref() {
            return this.index == 0 ? 'BaseTree' : `BaseTree_${this.index}`;
        },
        /**
         * <Object> 配置选项
         * label <string, function(data, node)> 指定节点标签为节点对象的某个属性值，初始值为 name
         * children <string> 指定子树为节点对象的某个属性值，初始值为 children
         * disabled <boolean, function(data, node)> 指定节点选择框是否禁用为节点对象的某个属性值
         * isLeaf <boolean, function(data, node)> 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
         */
        defaultProps() {
            const { label, children, disabled, isLeaf } = this.config;
            return {
                label: label || 'name' ,
                children: children || 'children',
                disabled,
                isLeaf
            }
        },
        /**
         * nodeKey <string> 每个树节点用来作为唯一标识的属性，默认为 id
         */
        nodeKey() {
            return this.config.nodeKey || 'id';
        },
        /**
         * defaultExpandAll <boolean> 是否默认展开全部树，默认为 false
         */
        defaultExpandAll() {
            return Boolean(this.config.defaultExpandAll);
        },
        /**
         * defaultExpandedKeys <array> 默认展开的节点的 key 的数组
         */
        defaultExpandedKeys() {
            return this.config.defaultExpandedKeys || [];
        },
        /**
         * showCheckbox <boolean> 节点是否可被选择，默认为 false
         */
        showCheckbox() {
            return Boolean(this.config.showCheckbox);
        },
        /**
         * checkStrictly <boolean> 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认 false
         */
        checkStrictly() {
            return Boolean(this.config.checkStrictly);
        },
        /**
         * checkOnClickNode <boolean> 是否在点击节点的时候选中节点，仅 showCheckbox 为 true 时有效，默认为 false
         */
        checkOnClickNode() {
            return Boolean(this.config.checkOnClickNode);
        },
        /**
         * defaultCheckedKeys <array> 默认勾选的节点的 key 的数组
         */
        defaultCheckedKeys() {
            return this.config.defaultCheckedKeys || [];
        },
        /**
         * currentNodeKey <string, number> 当前选中的节点
         */
        currentNodeKey() {
            return this.config.currentNodeKey;
        },
        /**
         * highlightCurrent <boolean> 是否高亮当前选中节点，默认为 true
         */
        highlightCurrent() {
            return this.config.highlightCurrent === false ? false : true;
        },
        /**
         * filterPlaceholder <string> filter 输入框的 placeholder，默认为"请输入关键字"
         */
        filterPlaceholder() {
            return this.config.filterPlaceholder || '请输入关键字';
        },
        /**
         * draggable <boolean> 是否开启拖拽节点功能，默认为 false
         */
        draggable() {
            return Boolean(this.config.draggable);
        },
        /**
         * treeStyle <object> 树结构底层 style 样式
         */
        treeStyle() {
            return this.config.treeStyle || { padding: '20px' };
        },
        /**
         * expandOnClickNode <boolean> 是否在点击节点的时候展开或者收缩节点
         */
        expandOnClickNode() {
            return this.config.expandOnClickNode === false ? false : true;
        },
        /**
         * monitorNodeClick <boolean> 是否监听节点点击事件
         */
        monitorNodeClick() {
            return Boolean(this.config.monitorNodeClick);
        }
    },
    created() {
        // 将组件的 BaseTree 的 ref 放入父对象中
        this.pushRefs();
    },
    methods: {
        /**
         * 将组件的 BaseForm 的 ref 放入父对象中
         * 可通过该 ref 对象调用以下方法：
         * updateKeyChildren 通过 keys 设置节点子元素，接收两个参数，1. 节点 key 2. 节点数据的数组
         * getCheckedNodes 返回目前被选中的节点所组成的数组，接收两个参数，1.是否只是叶子节点，默认 false 2. 是否包含半选节点，默认 false
         * getCheckedKeys 返回目前被选中的节点的 key 所组成的数组，接收一个 boolean 类型的参数，是否仅返回被选中的叶子节点的 keys，默认 false
         * getNode 根据 data 或者 key 拿到 Tree 组件中的 node，接收一个参数，要获得 node 的 key 或者 data
         * remove 删除 Tree 中的一个节点，接收一个参数，要获得 node 的 key 或者 data
         * append 为 Tree 中的一个节点追加一个子节点，接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node
         * insertBefore 为 Tree 的一个节点的前面增加一个节点，接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的后一个节点的 data、key 或者 node
         * insertAfter 为 Tree 的一个节点的后面增加一个节点，接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的前一个节点的 data、key 或者 node
         */
        pushRefs() {
            this.$nextTick(() => {
                this.refs[this.ref] = this.$refs[this.ref];
            })
        },
        /**
         * 节点被点击时触发
         */
        handleNodeClick(data, node) {
            if (!data.disabled || this.monitorNodeClick) {
                this.$emit('handleNodeClick', data, node);
            }
        },
        /**
         * 当复选框被点击的时候触发
         * @params {object} data 该节点所对应的对象
         */
        handleCheck(data) {
            this.$emit('handleCheck', data);
        },
        /**
         * 节点选中状态发生变化时的回调
         * @params {object} data 该节点所对应的对象
         * @params {boolean} checked 节点本身是否被选中
         */
        handleCheckChange(data, checked) {
            this.$emit('handleCheckChange', data, checked);
        },
        /**
         * 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
         * @params {string} value 过滤的目标值
         * @params {object} data 节点的数据对象
         * @params {string} node 节点的所有属性对象，包含 data 及 checked、isCurrent 等值
         */
        filterNodeMethod(value, data, node) {
            if (!value) return true;
            // 如果外部传入 filterMethod 且是个 function 的话，执行该 function，跳过默认方法
            if (this.filterMethod && typeof this.filterMethod === 'function') {
                return this.filterMethod(value, data, node);
            } else {
                const { label } = this.defaultProps;
                return data[this.nodeKey] == value || data[label].indexOf(value) > -1;
            }
        },
        /**
         * 判断节点能否被拖拽
         * @params {object} node 节点对象
         */
        allowDrag(node) {
            return node.data.draggable;
        },
        /**
         * 是否展示 tooltip
         * @param {object} data 节点数据
         */
        showTooltip(data) {
            const name = data[this.defaultProps.label];
            const { showTooltip, tooltipLimit } = this.config;
            return showTooltip && name && name.length > (this.config.tooltipLimit || 20);
        }
    }
}
</script>
<style lang="scss" scoped>
#BaseTree {
    .filter-input {
        width: 200px;
        margin-left: 20px;
        margin-bottom: 10px;
    }
    
    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        color: #409eff;
    }
   
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .disabled {
        color: gray;
        cursor: not-allowed;
    }
}
</style>