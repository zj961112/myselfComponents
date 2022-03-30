<template>
	<div id="filterDate" style="float: left">
		<!-- <div class="label">{{item.label}}：</div> -->
		<el-date-picker
			:name="name" 
			type="date"
			placeholder="请选择日期"
			v-model="datetime"
			:clearable="clearable"
			@change="_handleChange"
			v-if="dateType == 'date'">
		</el-date-picker>
		<el-date-picker
			:name="name" 
			type="month"
			placeholder="请选择月份"
			v-model="datetime"
			:clearable="clearable"
			@change="_handleChange"
			v-if="dateType == 'month'">
		</el-date-picker>
		<el-date-picker
			:name="name" 
			type="daterange"
			unlink-panels
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			:clearable="clearable"
			:picker-options="pickerOption"
			v-model="datetime"
			@change="_handleChange"
			v-if="dateType == 'daterange'"
			style="margin-right: 10px;">
		</el-date-picker>
		<el-date-picker
			:name="name" 
			type="datetimerange"
			unlink-panels
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			:clearable="clearable"
			value-format="yyyy-MM-dd HH:mm:ss"
			:picker-options="pickerOption"
			v-model="datetime"
			@change="_handleChange"
			v-if="dateType == 'datetimerange'"
			style="margin-right: 10px;">
		</el-date-picker>
		<el-date-picker
			:name="name" 
			type="daterange"
			format="yyyy-MM" 
			align="left"
			unlink-panels
			range-separator="至"
			start-placeholder="起始时间"
			end-placeholder="结束时间"
			:clearable="clearable"
			v-model="datetime"
			@change="_handleChange"
			v-if="dateType == 'monthrange'"
			style="margin-right: 10px;">
		</el-date-picker>
	</div>
</template>
<script>
export default {
	name: 'Datetime',
	props: {
		index: {
			type: Number,
			default: 0
		},
		/*
		 * 传入的组件参数
		 * @param {string} type 组件类型，date为单个日期选择，daterange为日期范围选择
		 * @param {any} value 组件的值
		 * @param {boolean} clearable 是否可清除，默认false
		 * @param {string} valueFormat 日期格式，默认yyyy-MM-dd
		 * @param {pickerOption} type为daterange时可用，日期范围快捷选项，传入false关闭
		 */
		item: {
			type: Object,
			default() { }
		}
	},
	data() {
		return {
			datetime: this.item.value // 日期组件的值
		}
	},
	computed: {
		// 元素名称，便于定位
		name() {
			return `BaseFilter__${this.item.key}`;
		},
		// 返回组件类型，date为单个日期选择，daterange为日期范围选择，默认为date
		dateType() {
			return this.item.dateType || 'date';
		},
		// 返回日期组件是否可清除，默认false
		clearable() {
			return this.item.clearable || true;
		},
		// 返回日期组件的数值格式，默认为yyyy-MM-dd
		valueFormat() {
			return this.item.valueFormat || 'yyyy-MM-dd';
		},
		// 返回日期组件的快捷选项，日期组件为daterange时有效，默认返回最近三天、最近一周、最近一个月
		pickerOption() {
			if (this.item.pickerOption === false) {
				return {};
			} else {
				const daySecond = 3600 * 1000 * 24;
				var pickerOption = {
					shortcuts: [{
						text: '最近三天',
						onClick(picker) {
							const end = new Date(),
								start = new Date();
							start.setTime(start.getTime() - daySecond * 3);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一周',
						onClick(picker) {
							const end = new Date(),
								start = new Date();
							start.setTime(start.getTime() - daySecond * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date(),
								start = new Date();
							start.setTime(start.getTime() - daySecond * 30);
							picker.$emit('pick', [start, end]);
						}
					}]
				};
				Object.assign(pickerOption, this.item.pickerOption)
				return pickerOption;
			}
		}
	},
	watch: {
		// 监听传入参数的值改变并同步更新当前页面日期组件的绑定值
		'item.value': function (value) {
			this.datetime = value;
		}
	},
	methods: {
		/*
		 * 日期组件值改变时回调函数
		 * @param {string} value input的值
		 */
		_handleChange(value) {
			this.$emit('handleChange', this.item.key, value || []);
		},
	}
}

</script>
<style lang="scss">
#filterDate {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>