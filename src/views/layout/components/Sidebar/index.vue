<template>
    <div>
        <div class="logo">
            <img src="../../../../assets/images/logo.png" alt="">
        </div>
        <scroll-bar>            
            <el-menu mode="vertical" unique-opened :default-active="$route.meta.path || $route.path" :collapse="isCollapse" background-color="#001529" text-color="#fff" active-text-color="#fff">
                <sidebar-item :routes="routes"></sidebar-item>
            </el-menu>
        </scroll-bar>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
    components: { SidebarItem, ScrollBar },
    computed: {
        ...mapGetters([
            'sidebar'
        ]),
        routes() {
            return this.$router.options.routes;
        },
        isCollapse() {
            return !this.sidebar.opened;
        },
    },
}

</script>
<style lang="scss" scoped>
@import '../../../../styles/variables.scss';
.logo {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $menuBg;
    img {
        width: 180px;
    }
}
</style>