<template>
    <el-tooltip
        :value="value"
        :effect="effect"
        :content="content"
        :placement="placement"
        :disabled="disabled"
        :offset="offset"
        :transition="transition"
        :visible-arrow="visibleArrow"
        :popper-options="popperOptions"
        :open-delay="openDelay"
        :manual="manual"
        :popper-class="popperClass"
        :enterable="enterable"
        :hide-after="hideAfter"
        :tabindex="tabindex"
        >
        <slot name="content"></slot>
    </el-tooltip>
</template>
<script>
export default {
    name: 'BaseTooltip',
    props: {
        value: null,
        content: [String, Number],
        disabled: [Boolean],
        configs: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
        effect() {
            return this.configs.effect || 'dark';
        },
        placement() {
            return this.configs.placement || 'top';
        },
        offset() {
            return this.configs.offset || 0;
        },
        transition() {
            return this.configs.transition || 'el-fade-in-linear';
        },
        visibleArrow() {
            return this.configs.visibleArrow === false ? false : true;
        },
        popperOptions() {
            return Object.assign({}, this.configs.popperOptions);
        },
        openDelay() {
            return this.configs.openDelay || 0;
        },
        manual() {
            return Boolean(this.configs.manual);
        },
        popperClass() {
            return this.configs.popperClass;
        },
        enterable() {
            return this.configs.enterable === false ? false : true;
        },
        hideAfter() {
            return this.configs.hideAfter || 0;
        },
        tabindex() {
            return this.configs.tabindex || 0;
        }
    }
}
</script>
<style lang="scss" scoped>
#BaseTooltip {
    display: flex;
    width: auto;
}
</style>