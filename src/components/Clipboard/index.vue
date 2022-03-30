<template>
	<span class="btn" style="color: #409EFF;cursor: pointer;" :data-clipboard-text="message" @click="validateEmpty">{{title}}</span>
</template>
<script>
import Clipboard from 'clipboard';
export default {
	props: {
		title: {
			type: String,
			default: '复制'
		},
		message: {
			type: String,
			default: ''
		}
	},
	created() {
		var clipboard = new Clipboard('.btn');
		clipboard.on('success', (e) => {
			this.$message.success('复制成功');
		})
		clipboard.on('error', (e) => {
			this.$message.error('复制失败');
		})
	},
	methods: {
		validateEmpty() {
			if (!this.message) {
				this.$message.error('当前数据为空，复制失败')
			}
		}
	}
}
</script>
