<template>
    <div class="menu-wrapper">
        <!-- 右边导航权限控制 -->
        <template v-for="item in routes.filter(i => !routerNames.includes(i.name))">
            <el-submenu :index="item.name || item.path" :key="item.name" v-if="!item.hidden">
                <template slot="title" >
                    <div @click="redirect(item)">
                        <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                        <span v-if="item.meta.title">{{item.meta.title}}</span>
                    </div>
                </template>
                <template v-for="child in item.children.filter(c => !c.hidden && routerNames.includes(c.name))">
                    <sidebar-item class="nest-menu" :routes="[child]" :key="child.path" v-if="child.children && child.children.length > 0"></sidebar-item>
                    <router-link v-else :to="item.path + '/' + child.path" :key="child.name">
                        <el-menu-item :index="item.path + '/' + child.path">
                            <svg-icon v-if="child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                            <span v-if="child.meta.title">{{child.meta.title}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </div>
</template>
<script>
export default {
    name: 'SidebarItem',
    props: {
        routes: {
            type: Array
        }
    },
    computed: {
        routerNames() {
            return this.$store.getters.routerNames;
        }
    },
    methods: {
        showMenu(item) {
            const { name, hidden, children } = item;
            return !hidden && children && children.length > 0 && this.routerNames.includes(name);
        },
        showChildMenu(child) {
            const { name, children } = child;
            return children && children.length > 0;
        },
        redirect(item) {
            this.$router.push({
                path: item.redirect
            })
        },
    }
}

</script>
