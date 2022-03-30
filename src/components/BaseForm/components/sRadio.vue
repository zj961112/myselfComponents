<template>
    <div id="formRadio">
        <el-radio-group
            v-model="item.value"
            @change="_handleChange"
            :disabled="item.disabled"
            :style="style">
            <el-radio :label="radio.code" v-for="radio in item.list" :key="radio.code">{{radio.name}}</el-radio>
        </el-radio-group>
    </div>
</template>
<script>
export default {
    name: 'formRadio',
    props: {
        /*
         * 传入的组件参数
         * @param {any} value 组件的值
         */
        item: {
            type: Object,
            default() { }
        }
    },
    computed: {
		// select 样式
        style() {
			return {
				maxWidth: this.item.maxWidth || '300px'
			}
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
#formRadio {
    display: inline-block;
    align-items: center;
    .el-radio__label {
        font-weight: initial;
    }
}
</style>