<template>
    <BaseDialog :refs="refs" :index="index" :config="dialogConfig" @handleConfirm="handleConfirm" @handleClose="handleClose">
        <div slot="dialog-content">
            <BaseForm :refs="$refs" :index="index" :labelWidth="labelWidth" :form="formData" :footerConfig="footerConfig">
                <div :slot="`form-${key}`" v-for="(value, key) in formData" :key="key">
                    <slot :name="`form-${key}`"></slot>
                </div>
            </BaseForm>
        </div>
    </BaseDialog>
</template>
<script>
import BaseDialog from '../BaseDialog';
import BaseForm from '../BaseForm';
export default {
    name: 'FormDialog',
    components: {
        BaseDialog,
        BaseForm
    },
    props: {
        /**
         * 序列，存在多个 BaseDialog 时使用
         */
        index: {
            type: Number,
            default: 1
        },
        /**
         * refs 对象
         */
        refs: {
            type: Object,
            default() {
                return {}
            }
        },
        dialogConfig: {
            type: Object,
            default() {
                return {}
            }
        },
        formData: {
            type: Object,
            default() {
                return {}
            }
        },
        labelWidth: {
            type: Number,
            default: 150
        }
    },
    data() {
        return {
            footerConfig: {
                show: false
            }
        }
    },
    computed: {
        formRef() {
            return `BaseForm_${this.index}`;
        }
    },
    methods: {
        handleConfirm(cb) {
            this.$refs[this.formRef].validate(valid => {
                if (valid) {
                    this.$emit('submit', () => {
                        this.clearFormData();
                        cb();
                    });
                } else {
                    return false;
                }
            })
        },
        handleClose() {
            setTimeout(() => {
                this.clearFormData();
                this.$emit('cancel');
            }, 200)
        },
        clearFormData() {
            this.$refs[this.formRef].resetFields();
            for (let key in this.formData) {
                this.formData[key].value = JSON.parse(JSON.stringify(this.formData[key].defaultValue || '')); 
            }
        }
    } 
}
</script>