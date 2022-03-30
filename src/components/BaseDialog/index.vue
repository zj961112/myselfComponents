<template>
    <div id="BaseDialog">
        <el-dialog
            :ref="ref"
            :visible.sync="config.show"
            :title="title"
            :width="width"
            :append-to-body="appendToBody"
            :fullscreen="fullscreen"
            :custom-class="customClass"
            :close-on-click-modal="closeOnClickModal"
            :close-on-press-escape="closeOnPressEscape"
            :show-close="showClose"
            :before-close="handleClose"
            :center="center">
            <div class="dialog-content">
                <slot name="dialog-content"></slot>
            </div>
            <div slot="footer" class="dialog-footer" v-if="showFooter">
                <el-button @click="handleClose" v-if="showCancel">{{cancelText}}</el-button>
                <el-button type="primary" @click="handleConfirm" v-if="showConfirm">{{confirmText}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'BaseDialog',
    props: {
        /**
         * 序列，存在多个 BaseDialog 时使用
         */
        index: {
            type: Number,
            default: 0
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
        /**
         * 配置信息
         * title
         * show
         * width
         * appendToBody
         * closeConfirm
         * fullscreen
         * customClass
         * closeOnClickModal
         * closeOnPressEscape
         * showClose
         * center
         * showFooter
         * showCancel
         * cancelText
         * showConfirm
         * confirmText
         */
        config: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
        /**
         * ref 的值
         * 当 index 为 0 时返回 BaseDialog，否则返回 BaseDialog-{index}，以确保多个组件时 ref 不重复
         */
        ref() {
            return this.index === 0 ? 'BaseDialog' : `BaseDialog_${this.index}`; 
        },
        title() {
            return this.config.title || '标题';
        },
        width() {
            return this.config.width || '600px';
        },
        appendToBody() {
            return Boolean(this.config.appendToBody);
        },
        closeConfirm() {
            return Boolean(this.config.closeConfirm);
        },
        fullscreen() {
            return Boolean(this.config.fullscreen);
        },
        customClass() {
            return this.config.customClass;
        },
        closeOnClickModal() {
            return Boolean(this.config.closeOnClickModal);
        },
        closeOnPressEscape() {
            return Boolean(this.config.closeOnPressEscape);
        },
        showClose() {
            return this.config.showClose === false ? false : true;
        },
        center() {
            return Boolean(this.config.center);
        },
        showFooter() {
            return this.config.showCancel === false ? false : true;
        },
        showCancel() {
            return this.config.showCancel === false ? false : true;
        },
        cancelText() {
            return this.config.cancelText || '取消';
        },
        showConfirm() {
            return this.config.showConfirm === false ? false : true;
        },
        confirmText() {
            return this.config.confirmText || '确定';
        }
    },
    created() {
        // 将组件的 BaseTree 的 ref 放入父对象中
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
        beforeClose(done) {
            if (this.closeConfirm) {
                this.$confirm('关闭将清空当前数据，是否确认关闭？', '提示', { type: 'warning' }).then(_ => {
                    this.$emit('beforeClose');
                    done();
                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                }).catch(_ => {});
            } else {
                this.$emit('beforeClose');
                done();
                if (cb && typeof cb === 'function') {
                    cb();
                }
            }
        },
        handleClose() {
            if (this.closeConfirm) {
                this.$confirm('关闭将清空当前数据，是否确认关闭？', '提示', { type: 'warning' }).then(_ => {
                    this.config.show = false;
                    this.$emit('handleClose');
                }).catch(_ => {});
            } else {
                this.config.show = false;
                this.$emit('handleClose');
            }
        },
        handleConfirm() {
            this.$emit('handleConfirm', () => {
                this.config.show = false;
            })
        }
    }
}
</script>
<style lang="scss">
#BaseDialog {
    .el-dialog {
        max-height: 70%;
    }
    .el-dialog__body {
        padding: 10px;
        margin-bottom: 10px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }
}
</style>