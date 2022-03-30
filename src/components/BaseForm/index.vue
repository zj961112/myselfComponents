<template>
    <div id="BaseForm">
        <h2 class="title" v-if="title">{{title}}</h2>
        <el-row :gutter="gutter">
            <el-form :ref="ref" :model="form" :label-width="labelWidth + 'px'">
                <el-col :span="item.span || 24" :offset="item.offset || 0" v-for="item in formArray.filter(i => !i.hidden)" :key="item.key">
                    <el-form-item :label="item.label + (item.label?'：':'')" :prop="item.key + '.value'" :rules="getItemRule(item)" :class="{'show-required': 
                            item.showRequired}">
                        <components :is="'s' + item.type" :item="item" :defaultWidth="defaultWidth" @handleChange="handleValueChange" v-if="!item.isSlot" style="width: 100%;"></components>
                        <slot :name="'form-' + item.key" v-else></slot>
                    </el-form-item>
                </el-col>
                <el-col class="footer" :style="footerStyle" :span="24" v-if="showFooter">
                    <el-button @click="cancel" v-if="showCancel">{{cancelText}}</el-button>
                    <el-button class="confirm" type="primary" :loading="loading" @click="onSubmit" v-if="showConfirm">{{confirmText}}</el-button>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>
<script>
import { sInput, sSelect, sUpload, sRadio, sDate, sAutocomplete } from './components';
import { compareObjectArr } from '@/utils/common';
import { validateInteger, validateNumber, validateChinese } from '@/utils/validator';

export default {
    name: 'BaseForm',
    components: {
        sInput,
        sSelect,
        sUpload,
        sRadio,
        sDate,
        sAutocomplete
    },
    props: {
        /**
         * 传入表单数据
         * <Object> prop 即为 key
         * type Input Select
         * value 初始值及用于保存的值
         * label 标签名称
         * span 占据的宽度，1-24
         * offset 偏移量，1-24
         * sort 排序
         * selectList type 为 Select 时必填，默认为 code/name 对象数组，如并非 code/name 需另传入 optionKey 和 optionValue
         * optionKey SelectList 传入时选填
         * optionValue SelectList 传入时选填
         * rule 表单校验规则
         * disabled 是否不可编辑
         * hidden 是否隐藏
         */
        form: {
            type: Array,
            default() { }
        },
        /**
         * label 宽度
         */
        labelWidth: {
            type: Number,
            default: 100
        },
        /**
         * 每一栏间隔
         */
        gutter: {
            type: Number,
            default: 0
        },
        /**
         * 表单 title
         */
        title: {
            type: String,
            default: ''
        },
        /**
         * 底部配置
         * @param {boolean} showConfirm 是否展示提交按钮
         * @param {string} confirmText 确认按钮文案
         * @param {boolean} showCancel 是否展示取消按钮
         * @param {string} cancelText 取消按钮文案
         * @param {string} textAlign 按钮对齐方式
         */
        footerConfig: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * 序号
         */
        index: {
            type: Number,
            default: 0
        },
        /**
         * 存储 refs
         */
        refs: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        /**
         * ref 的值
         * 当 index 为 0 时返回 BaseForm，否则返回 BaseForm_{index}，以确保多个组件时 ref 不重复
         */
        ref() {
            return this.index == 0 ? 'BaseForm' : `BaseForm_${this.index}`;
        },
        // 将 form 对象转化成 array
        formArray() {
            const arr = [];
            for (let key in this.form) {
                this.form[key].key = key;
                if (typeof this.form[key].disabled === 'function') {
                    this.form[key].disabled = this.form[key].disabled();
                }
                if (typeof this.form[key].hidden === 'function') {
                    this.form[key].hidden = this.form[key].hidden();
                }
                arr.push(this.form[key])
            }
            return compareObjectArr(arr, 'sort');
        },
        // footer 部分样式
        footerStyle() {
            const { style, textAlign, marginTop } = this.footerConfig;
            return style || {
                textAlign: textAlign || 'center',
                marginLeft: `${textAlign === 'left' ? this.labelWidth : 0}px`,
                marginTop: `${marginTop || 0}px`
            }
        },
        /**
         * 是否显示确认按钮
         */
        showConfirm() {
            return this.footerConfig.showConfirm === false ? false : true;
        },
        /**
         * 确认按钮文案
         */
        confirmText() {
            return this.footerConfig.confirmText || '保存';
        },
        /**
         * 是否显示取消按钮
         */
        showCancel() {
            return this.footerConfig.showCancel === false ? false : true;
        },
        /**
         * 取消按钮文案
         */
        cancelText() {
            return this.footerConfig.cancelText || '返回';
        },
        /**
         * 是否展示底部
         */
        showFooter() {
            return this.footerConfig.show === false ? false : true;
        },
        /**
         * 默认最大宽度
         */
        defaultWidth() {
            let maxWidth = 300;
            const clientWidth = document.documentElement.clientWidth;
            if (clientWidth >= 1500 && clientWidth < 1650) {
                maxWidth = 250;
            } else if (clientWidth < 1500) {
                maxWidth = 200;
            }
            return maxWidth;
        }
    },
    created() {
        // 将组件的 BaseForm 的 ref 放入父对象中
        this.pushRefs();
    },
    methods: {
        /**
         * 将组件的 BaseForm 的 ref 放入父对象中
         */
        pushRefs() {
            this.$nextTick(() => {
                this.refs[this.ref] = this.$refs[this.ref];
            })
        },
        /**
         * 监听值的变化
         */
        handleValueChange(key, value) {
            this.form[key].value = typeof value === 'string' ? value.trim() : value;
            if (this.form[key].change && typeof this.form[key].change === 'function') {
                this.form[key].change(value);
            }
        },
        /**
         * 表单数据提交
         */
        onSubmit() {
            this.loading = true;
            this.$refs[this.ref].validate(valid => {
                if (valid) {
                    this.$emit('submit', () => {
                        this.loading = false;
                    });
                } else {
                    return false;
                }
            })
        },
        /**
         * 表单取消
         */
        cancel() {
            this.$emit('formCancel')
        },
        /**
         * 获取表单项的校验规则
         */
        getItemRule(item) {
            const { ruleType, rule, label, errorText, trigger } = item;
            const that = this;
            if (ruleType) {
                return [{
                    required: true,
                    trigger: trigger,
                    validator: (rule, value, callback) => {
                        let errText;
                        if (ruleType instanceof Array) {
                            for (let i = 0; i < ruleType.length; i++) {
                                if (errText) break;
                                errText = that.validator({
                                    ruleType: ruleType[i],
                                    value, 
                                    label, 
                                    errorText
                                });
                            }
                            callback(errText ? new Error(errText) : undefined)
                        } else {
                            errText = that.validator({
                                ruleType, 
                                value, 
                                label, 
                                errorText
                            });
                            callback(errText ? new Error(errText) : undefined)
                        }
                    }
                }]
            } else {
                return rule;
            }
        },
        validator(params = {}) {
            const { ruleType, value, label, errorText } = params;
            let errText;
            switch (ruleType) {
                case 'non-empty': 
                    if (value === null || value === undefined || value === '' || value === {} || value === []) {
                        errText = errorText || `请输入${label}`;
                    }
                    break;
                case 'number':
                    if (!validateNumber(value)) {
                        errText = errorText || `请输入正确的${label}，值为数字`;
                    }
                    break;
                case 'posNum': 
                    if (!validateNumber(value) || value <= 0) {
                        errText = errorText || `请输入正确的${label}，值为大于0的数字`;
                    }
                    break;
                case 'posInt':
                    if (!validateInteger(value) || value <= 0) {
                        errText = errorText || `请输入正确的${label}，值为大于0的整数`;
                    } 
                    break;
                case 'excludeChinese': 
                    if (!value || validateChinese(value)) {
                        errText = errorText || `请输入正确的${label}，值不得包含中文`;
                    }
                    break;
                case 'array':
                    if (!(value instanceof Array) || value.length === 0) {
                        errText = errorText || `请选择${label}`;
                    };
                    break;
                case 'chinese': 
                    if (!value || !validateChinese(value)) {
                        errText = errorText || `请输入正确的${label}，值为中文`;
                    }
                    break;
            };
            return errText;
        }
    }
}
</script>
<style lang="scss" scoped>
#BaseForm {
    padding: 20px 20px 0;
    .title {
        margin-bottom: 30px;
    }
    .footer {
        width: 100%;
        margin-top: 10px;
        .confirm {
            margin-left: 30px;
        }
    }
}
</style>
<style lang="scss">
#BaseForm {
    .show-required .el-form-item__label:before {
        content: "*";
        color: #F56C6C;
        margin-right: 4px;
    }
    .el-icon-question {
        font-size: 16px;
        margin-left: 10px;
        color: #E6A23C;
    }
}
</style>