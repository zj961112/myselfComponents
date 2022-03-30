<template>
	<div id="formAutocomplete">
		<el-tooltip class="item" effect="dark" :content="item.value" placement="top" :disabled="!(item.value && item.showTooltip)">
            <el-autocomplete
			    :placeholder="placeholder" 
			    :clearable="clearable" 
			    :disabled="item.disabled"
			    v-model="item.value" 
                :fetch-suggestions="querySearch"
                popper-class="autocomplete-popper"
                @select="handleSelect"
                @change="handleChange" 
                :style="style">
            </el-autocomplete>
		</el-tooltip>
	</div>
</template>
<script>
export default {
	name: 'formAutocomplete',
	props: {
		/*
		 * 传入的组件参数
		 * @params { any } value 组件的值
		 * @params { boolean } clearable 是否可清除，默认 false
		 * @params { string } placeholder input 占位符，默认为"请输入内容"
		 * @params { number } maxlength 最大长度
         * @params { array } selectList 建议列表 
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
        /**
         * 建议列表
         */
        selectList() {
            const list = this.item.selectList || [];
            const _list = [];
            list.forEach(item => {
                if (typeof item === 'object') {
                    _list.push(item);
                } else {
                    _list.push({
                        value: item,
                        address: item
                    })
                }
            });
            return _list;
        }
	},
	methods: {
		/*
		 * input值改变时回调函数
		 * @param {string} value input的值
		 */
		handleChange(value) {
			this.$emit('handleChange', this.item.key, value);
		},
        querySearch(queryString, cb) {
            var list = this.selectList;
            var results = queryString ? list.filter(this.createFilter(queryString)) : list;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (list) => {
                return (list.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(item) {
			this.handleChange(item.value);
        }
	}
}

</script>
<style lang="scss" scoped>
#formAutocomplete {
	display: flex;
	justify-content: start;
    .el-autocomplete {
        width: inherit;
        display: flex;
    }
}
</style>
<style lang="scss">
.autocomplete-popper {
	width: inherit !important;
}
</style>