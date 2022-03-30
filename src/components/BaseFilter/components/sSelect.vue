<template>
	<div id="filterSelect" style="float: left">
		<!-- <div class="label">{{item.label}}：</div> -->
		<el-select 
			:value="value" 
			:placeholder="placeholder" 
			:clearable="clearable" 
			@change="_handleChange" 
			filterable>
			<el-option 
				:key="select[item.optionKey || 'code']" 
				:label="select[item.optionLabel || 'name']" 
				:value="select[item.optionValue || 'code']" 
				v-for="select in item.selectList">
			</el-option>
		</el-select>
	</div>
</template>
<script>
export default {
	name: 'sInput',
	props: {
		index: {
			type: Number,
			default: 0
		},
		/*
		 * 传入的组件参数
		 * @param {any} value 组件的值
		 * @param {boolean} clearable 是否可清除，默认false
		 * @param {string} placeholder input占位符，默认为"请输入内容"
		 */
		item: {
			type: Object,
			default () {}
		}
	},
	computed: {
		// 元素名称，便于定位
		name() {
			return `BaseFilter__${this.item.key}`;
		},
		// 返回input绑定的值
		value() {
			return this.item.value;
		},
		// 返回input的placeholder，默认为"请输入内容"
		placeholder() {
			return this.item.placeholder ||`请选择${this.item.label}`;
		},
		// 返回input是否可清除，默认true，当前elementUI版本不支持
		clearable() {
			return this.item.clearable || true;
		}
	},
	methods: {
		/*
		 * input值改变时回调函数
		 * @param {string} value input的值
		 */
		_handleChange(value) {
			this.$emit('handleChange', this.item.key, value);
		}
	}
}

</script>
<style lang="scss">
#filterSelect {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>