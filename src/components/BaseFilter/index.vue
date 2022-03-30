<template>
    <div id="BaseFilter">
        <div class="filter">
            <el-row class="filter-header">
                <el-col :span="12" class="filter-header__title">查询条件</el-col>
                <el-col :span="12" class="filter-header__buttons">
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="reset">重置</el-button>
                    <span class="filter-header__spread color-primary pointer" @click="handleSpreadClick" v-if="showSpread">
                        {{ isSpread ? '收起' : '展开' }}
                        <i class="el-icon-arrow-down" v-if="!isSpread"></i>
                        <i class="el-icon-arrow-up" v-else></i>
                    </span>
                </el-col>
            </el-row>
            <el-row :gutter="10" :class="{ spread: !isSpread }">
                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="item in conditionsArr" :key="item.key">
		            <div class="label" :style="{width: labelWidth + 'px'}">{{item.label}}：</div>
                    <components :is="item.type" :item="item" @handleChange="handleValueChange" v-if="!item.isSlot">
                    </components>
                    <slot :name="'filter-' + item.key" v-else></slot>
                </el-col>
            </el-row>
            <el-row v-if="showAddBtn">
                <el-button class="filter-button--add" type="primary" @click="handleClickAdd">{{addBtnText}}</el-button>
            </el-row>
        </div>
    </div>
</template>
<script>
import { sInput, sDate, sSelect } from './components';
import { compareObjectArr } from '@/utils/common';
export default {
    name: 'BaseFilter',
    components: {
        sInput,
        sSelect,
        sDate
    },
    props: {
        // 查询组件的配置，目前支持sInput组件、sSeletct、sDate组件，具体参数请参照对应组件详细注释
        conditions: {
            type: Object,
            default() { }
        },
        // 是否展示新增按钮，默认 true
        showAddBtn: {
            type: Boolean,
            default: true
        },
        // 新增按钮文本
        addBtnText: {
            type: String,
            default: '新增'
        },
        labelWidth: {
            type: Number,
            default: 120
        }
    },
    data() {
        return {
            isSpread: true, // 是否展开
            pages: { // 分页参数
                pageNum: 1,
            }
        }
    },
    computed: {
        conditionsArr() {
            const arr = [];
            for (let key in this.conditions) {
                if (this.conditions[key].hidden) continue;
                this.conditions[key].value = this.conditions[key].defaultValue;
                this.conditions[key].key = key;
                arr.push(this.conditions[key])
            }
            return compareObjectArr(arr, 'sort');
        },
        showSpread() {
            return this.conditionsArr.length > 3;
        }
    },
    methods: {
        /**
         * 监听值的变化
         */
        handleValueChange(key, value) {
            this.conditions[key].value = value;
            if (this.conditions[key].change && typeof this.conditions[key].change === 'function') {
                this.conditions[key].change(value);
            }
        },
        /**
         * 监听
         */
        handleSpreadClick() {
            this.isSpread = !this.isSpread;
        },
        /**
         * 查询
         */
        handleSearch() {
            this.$emit('fetchData', this.pages);
        },
        /**
         * 重置
         */
        reset() {
            for (let key in this.conditions) {
                this.conditions[key].value = this.conditions[key].defaultValue || '';
            }
            this.handleSearch();
        },
        /**
         * 触发点击按钮事件
         */
        handleClickAdd() {
            this.$emit('add');
        }
    }
}
</script>
<style lang="scss">
#BaseFilter {
    padding: 20px;
    .el-input,
    .el-select {
        width: 250px;
    }
    .el-date-editor {
        width: 250px;
    }
    .el-range-separator {
        width: 14px;
        text-align: center;
    }
    .el-date-editor .el-range-separator {
        padding: 0;
    }
    .label {
        white-space: nowrap;
        text-align: right;
        float: left;
        height: 32px;
        line-height: 32px;
    }
    .el-col {
        margin-bottom: 10px;
    }
    .filter-header {
        &__title {
            font-size: 20px;
            font-weight: 600;
        }
        &__buttons {
            // padding-right: 50px;
            text-align: right;
            .el-button {
                width: 65px;
            }
        }
        &__spread {
            margin-left: 20px;
        }
    }
    .filter .spread {
        height: 42px;
        overflow: hidden;
    }
    .filter-button--add {
        float: right;
        min-height: 22px;
        min-width: 150px;
    }
}
</style>