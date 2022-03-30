<template>
	<div id="formInput">
		<el-tooltip class="item" effect="dark" :content="item.value" placement="top" :disabled="!showTooltip">
			<el-input 
			:type="item.inputType || 'text'" 
			:placeholder="placeholder" 
			:clearable="clearable" 
			v-model="item.value" 
			:disabled="item.disabled"
			:rows="item.rows"
			:resize="item.resize || 'none'"
			:autosize="item.autosize"
			:show-word-limit="showWordLimit"
			:maxlength="item.maxlength"
			@change="handleChange" 
			:style="style">
			</el-input>
		</el-tooltip>
		<el-tooltip effect="dark" :content="item.questions" placement="top" v-if="item.questions">
			<i class="el-icon-question"></i>
		</el-tooltip>
	</div>
</template>
<script>
export default {
	name: 'formInput',
	props: {
		/*
		 * 传入的组件参数
		 * @params { any } value 组件的值
		 * @params { boolean } clearable 是否可清除，默认 false
		 * @params { string } placeholder input 占位符，默认为"请输入内容"
		 * @params { string } inputType 类型，默认 text。可为 text、textarea 和 其他原生 input 的 type 值
		 * @params { number } rows inputType 为 textarea 时可用
		 * @params { string } resize 控制是否能被用户缩放，值可为 none both horizontal vertical，默认为 none
		 * @params { boolean } inputType 为 textarea 时有效，默认 false
		 * @params { number } maxlength 最大长度
		 * @params { boolean } showWordLimit 是否显示最大字数限制
		 */
		item: {
			type: Object,
			default () {}
		},
		defaultWidth: {
			type: Number,
			default: 300
		}
	},
	computed: {
		// 返回 input 的placeholder，默认为"请输入XX"
		placeholder() {
			return this.item.placeholder || `请输入${this.item.label}`;
		},
		// 返回 input 是否可清除，默认 true
		clearable() {
			return this.item.clearable || true;
		},
		// input 样式
		style() {
			return {
				maxWidth: this.item.maxWidth || `${this.defaultWidth}px`
			}
		},
		// 是否展示文字限制
		showWordLimit() {
			return this.item.showWordLimit === false ? false : (this.item.maxlength > 0);
		},
		showTooltip() {
			return this.item.value && this.item.showTooltip;
			!(item.value && item.showTooltip)
		},
		/**
         * select 配置信息
         */
        configs() {
            return this.item.configs || {};
        },
		/**
         * 是否展示提示框
         */
        showTooltip() {
            const showTooltip = Boolean(this.configs.showTooltip || this.item.showTooltip);
            return showTooltip && this.item.value;
        },
	},
// 	watch: {
// 		'item.value'(value) {
// 			if (this.item.key === 'dealerName') {
// if (this.showTooltip && !value) {
// 				this.item.showTooltip = false;
// 				this.configs.showTooltip = false;
// 			}
// 			console.log(this.showTooltip)
// 			}
			
// 		}
// 	},
	methods: {
		/*
		 * input值改变时回调函数
		 * @param {string} value input的值
		 */
		handleChange(value) {
			this.$emit('handleChange', this.item.key, value);
		},
	}
}

</script>
<style lang="scss">
#formInput {
	display: flex;
	justify-content: start;
    align-items: center;
	.el-textarea__inner {
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    }
}
</style>