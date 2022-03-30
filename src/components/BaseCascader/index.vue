<template>
    <el-tooltip class="item" effect="dark" :content="getContent()" placement="top" :disabled="tooltipDisabled()">
        <el-cascader 
            :ref="ref"
            id="BaseCascader"
            v-model="value"
            :options="dataSource"
            :props="props"
            :placeholder="placeholder"
            :disabled="disabled"
            :clearable="clearable"
            :show-allLevels="showAllLevels"
            :collapse-tags="collapseTags"
            :separator="separator"
            :filterable="filterable"
            :multiple="multiple"
            @change="handleChange"
            @expand-change="handleExpandChange"
            @blur="handleBlur"
            @focus="handleFocus"
            @visible-change="handleVisibleChange"
            @remove-tag="handleRemoveTag">
        </el-cascader>
    </el-tooltip>
</template>
<script>
export default {
    name: 'BaseCascader',
    props: {
        /**
         * 序列号
         */
        index: {
            type: Number,
            default: 0
        },
        /**
         * 数据源
         */
        dataSource: {
            type: Array,
            default() {
                return []
            }
        },
        /**
         * <Object> 配置信息表
         * placeholder <string> 输入框占位文本
         * disabled <boolean> 是否禁用
         * clearable <boolean> 是否支持清空选项
         * showAllLevels <boolean> 输入框中是否现实选中值的完整路径
         * collapseTags <boolean> 多选模式下是否折叠Tag
         * separator <string> 选项分隔符
         * filterable <boolean> 是否可搜索选项
         * expandTrigger < string> 次级菜单的展开方式 click/hover
         * multiple <boolean> 是否多选
         * checkStrictly <boolean> 是否严格的遵守父子节点不相关联
         * emitPath <boolean> 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
         * lazy <boolean> 是否动态加载子节点，需与 lazyLoad 方法结合使用
         * lazyLoad <function> 加载动态数据的方法，仅在 lazy 为 true 时有效
         * value <string> 指定选项的值为选项对象的某个属性值
         * label <string> 指定选项标签为选项对象的某个属性值
         * children <string> 指定选项的子选项为选项对象的某个属性值
         * disabledKey <string> 指定选项的禁用为选项对象的某个属性值
         * leaf <string> 指定选项的叶子节点的标志位为选项对象的某个属性值
         */
        config: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * 绑定数据
         */
        value: {
            type: Array,
            default() {
                return []
            }
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
    computed: {
        /**
         * ref 的值
         * 当 index 为 0 时返回 BaseCascader，否则返回 BaseCascader-{index}，以确保多个组件时 ref 不重复
         */
        ref() {
            return this.index == 0 ? 'BaseCascader' : `BaseCascader_${this.index}`;
        },
        /**
         * 输入框占位文本
         */
        placeholder() {
            return this.config.placeholder || '请选择';
        },
        /**
         * 是否禁用
         */
        disabled() {
            return Boolean(this.config.disabled);
        },
        /**
         * 是否支持清空选项
         */
        clearable() {
            return this.config.clearable === false ? false : true;
        },
        /**
         * 输入框中是否显示选中值的完整路径	
         */
        showAllLevels() {
            return this.config.showAllLevels === false ? false : true;
        },
        /**
         * 多选模式下是否折叠Tag
         */
        collapseTags() {
            return Boolean(this.config.collapseTags);
        },
        /**
         * 选项分隔符
         */
        separator() {
            return this.config.separator || '/';
        },
        /**
         * 是否可搜索选项
         */
        filterable() {
            return this.config.filterable === false ? false : true;
        },
        /**
         * 配置信息
         */
        props() {
            const { expandTrigger, multiple, checkStrictly, emitPath, lazy, lazyLoad, value, label, children, disabledKey, leaf } = this.config;
            return {
                expandTrigger: expandTrigger || 'hover',
                multiple,
                checkStrictly: checkStrictly,
                emitPath: emitPath === false ? false : true,
                lazy,
                lazyLoad,
                value: value || 'value',
                label: label || 'label',
                children: children || 'children',
                disabled: disabledKey || 'disabled',
                leaf: leaf || 'leaf'
            }
        },
        /**
         * 是否展示提示框
         */
        showTooltip() {
            return Boolean(this.config.showTooltip);
        }
    },
    methods: {
        /**
         * 当选中节点变化时触发
         */
        handleChange(value) {
            this.$emit('handleChange', value);
        },
        /**
         * 当展开节点发生变化时触发
         */
        handleExpandChange() {
            this.$emit('handleExpandChange');
        },
        /**
         * 当失去焦点时触发
         */
        handleBlur() {
            this.$emit('handleBlur');
        },
        /**
         * 当获得焦点时触发
         */
        handleFocus() {
            this.$emit('handleFocus');
        },
        /**
         * 下拉框出现/隐藏时触发
         */
        handleVisibleChange() {
            this.$emit('handleVisibleChange');
        },
        /**
         * 在多选模式下，移除Tag时触发
         */
        handleRemoveTag() {
            this.$emit('handleRemoveTag');
        },
        /**
         * 获取 tooltip 显示内容
         */
        getContent() {
            if (!this.showTooltip) return;
            const ref = this.$refs[this.ref];
            let content = '';
            if (ref) {
                const values = this.$refs[this.ref].getCheckedNodes();
                if (values.length > 0 && values[0]) {
                    content = values[0].pathLabels.join(this.separator);
                }
            }
            return content;
        },
        /**
         * tooltip 是否可用
         */
        tooltipDisabled() {
            return !this.showTooltip || (this.value instanceof Array ? this.value.length == 0 : Boolean(this.value))
        }

    }
}
</script>
<style lang="scss" scoped>
#BaseCascader {
    width: inherit;
    display: flex;
}
</style>