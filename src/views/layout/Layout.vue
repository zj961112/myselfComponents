<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container">
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
import { Sidebar, AppMain } from '@/views/layout/components'

export default {
    name: 'layout',
    components: {
        Sidebar,
        AppMain,
    },
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    .main-container {
        padding-top: 85px;
    }
}
</style>
