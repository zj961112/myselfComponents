<template>
    <div id="formSelect">
		<el-tooltip effect="dark" :content="getContent()" placement="top" :disabled="!showTooltip">
            <div class="tooltip-content" :style="style">
                <el-select 
                    :value="item.value" 
                    :placeholder="placeholder" 
                    :clearable="clearable" 
                    @change="_handleChange" 
                    filterable 
                    :multiple="multiple"
                    :collapse-tags="collapseTags"
                    :disabled="item.disabled"
                    :style="style"
                    :class="classes">
                    <el-option 
                        :key="select[optionKey]" 
                        :label="select[optionLabel]" 
                        :value="select[optionValue]" 
                        v-for="select in selectList">
                        </el-option>
                </el-select>
            </div>
		</el-tooltip>
        <el-tooltip effect="dark" :content="item.questions" placement="top" v-if="item.questions">
            <i class="el-icon-question"></i>
        </el-tooltip>
    </div>
</template>
<script>
export default {
    name: 'formSelect',
    props: {
        /*
         * 传入的组件参数
         * @param {any} value 组件的值
         * @param {boolean} clearable 是否可清除，默认false
         * @param {string} placeholder input占位符，默认为"请输入内容"
         */
        item: {
            type: Object,
            default() { }
        },
        /**
         * 默认宽度
         */
        defaultWidth: {
			type: Number,
			default: 300
		}
    },
    computed: {
        /**
         * 下拉列表
         */
        selectList() {
            return this.configs.selectList || this.item.selectList || [];
        },
        /**
         * 返回 select 的 placeholder，默认为"请选择XX"
         */
        placeholder() {
            return this.configs.placeholder || this.item.placeholder || `请选择${this.item.label}`;
        },
        /**
         * 返回 select 是否可清除，默认 true
         */
        clearable() {
            return (this.configs.clearable === false || this.item.clearable === false) ? false : true;
        },
        /**
         * 样式
         */
		style() {
			return {
                width: '100%',
				maxWidth: this.item.maxWidth || `${this.defaultWidth}px`
			}
		},
        /**
         * optionKey
         */
        optionKey() {
            return this.item.optionKey || 'code';
        },
        /**
         * optionLabel
         */
        optionLabel() {
            return this.item.optionLabel || 'name';
        },
        /**
         * optionValue
         */
        optionValue() {
            return this.item.optionValue || 'code';
        },
        /**
         * select 配置信息
         */
        configs() {
            return this.item.configs || {};
        },
        /**
         * 是否多选
         */
        multiple() {
            return Boolean(this.configs.multiple);
        },
        /**
         * 多选时是否将选中值按文字的形式展示
         */
        collapseTags() {
            return Boolean(this.configs.collapseTags);
        },
        /**
         * 是否展示提示框
         */
        showTooltip() {
            const showTooltip = Boolean(this.configs.showTooltip);
            return showTooltip && (this.item.value instanceof Array ? this.item.value.length > 0 : Boolean(this.item.value));
        },
        /**
         * class 集合
         */
        classes() {
            const classArray = {
                200: 'small',
                250: 'medium',
                300: 'large'
            }
            return classArray[this.defaultWidth];
        }
    },
    methods: {
        /*
         * input值改变时回调函数
         * @param {string} value input的值
         */
        _handleChange(value) {
            this.$emit('handleChange', this.item.key, value);
        },
        /**
         * 获取 tooltip 显示内容
         */
        getContent() {
            if (!this.showTooltip) return;
            let content = '';
            if (this.multiple) {
                const values = this.item.value || [];
                const labels = this.selectList.filter(item => {
                    return values.includes(item[this.optionValue]);
                })
                content = labels.map(label => label[this.optionLabel]).join(',');
            } else {
                content = (this.selectList.find(item => this.item.value == item[this.optionValue]) || {})[this.optionLabel];
            };
            return content;
        },
    }
}

</script>
<style lang="scss">
#formSelect {
    display: flex;
	justify-content: start;
    align-items: center;
	.el-select {
		width: inherit;
        &.large .el-tag {
            max-width: 200px;
        }
        &.medium .el-tag {
            max-width: 150px;
        }
        &.small .el-tag {
            max-width: 110px;
        }
	}
    .tooltip-content {
        display: flex;
        justify-content: center;
        align-content: center;
    }
}
</style>