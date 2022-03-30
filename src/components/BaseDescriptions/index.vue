<template>
    <div id="BaseDescriptions">
        <el-descriptions :title="title" labelClassName="descriptions-item__label" :colon="false" :column="column" :style="getDescStyle()" v-if="!isSlot">
            <el-descriptions-item v-for="item in itemList" :key="item.prop" :label="`${item.label}:`">
                {{item.value}}
            </el-descriptions-item>
            <el-descriptions-item v-for="n in emptyCount" :key="n"></el-descriptions-item>
        </el-descriptions>
        <el-descriptions :title="title" :column="column" :style="getDescStyle()" labelStyle="width: 0px;" :colon="false" v-else>
            <el-descriptions-item label="" style="width: 0">
                <span>
                    <slot name="descriptions-slot-item"></slot>
                </span>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>
<script>
export default {
    name: 'BaseDescriptions',
    props: {
        title: {
            type: String,
            default: '标题'
        },
        dataSource: {
            type: Array,
            default() {
                return []
            }
        },
        column: {
            type: Number,
            default: 3
        },
        isSlot: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 返回 dataSource 中可展示的数据项
        itemList() {
            return this.dataSource.filter(data => !data.hidden);
        },
        // 自动补足 item 数组，避免最后一个 item 出现不对齐情况
        emptyCount() {
            const remainder = this.itemList.length % this.column;
            return  remainder === 0 ? 0 : this.column - remainder;
        }
    },
    methods: {
        getDescStyle() {
            return `width: ${100*(this.column / 3).toFixed(2)}%`;
        }
    }
}
</script>
<style lang="scss" scoped>
.el-descriptions {
    padding: 20px;
}
/deep/ .descriptions-item__label {
    width: 150px;
    text-align: right;
}

/deep/ .el-descriptions-item__content {
    width: 100%;
}
</style>