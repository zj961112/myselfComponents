<template>
    <div id="app">
        <navbar></navbar>
        <tags-view></tags-view>
        <keep-alive>
            <router-view :key="key" v-if="!$route.meta.noCache"></router-view>
        </keep-alive>
        <router-view :key="key" v-if="$route.meta.noCache"></router-view>
    </div>
</template>
<script>
import { Navbar, TagsView } from '@/views/layout/components';
export default {
    name: 'app',
    components: {
        Navbar,
        TagsView,
    },
    computed: {
        key() {
            var key = this.$route.name;
            for (var k in this.$route.params) {
                key += '/' + k + '=' + this.$route.params[k];
            }
            return key;
        },
    },
}

</script>
<style lang="scss">
@import './styles/index.scss'; // 全局自定义的css样式

</style>
