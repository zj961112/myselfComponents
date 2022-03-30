<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <el-breadcrumb-item :key="-1">
            <span class="title">{{title}}</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item,index) in levelList.filter(i => i.meta.title)" :key="item.path">
            <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
            <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    created() {
        this.getBreadcrumb()
    },
    data() {
        return {
            levelList: null
        }
    },
    computed: {
        title() {
            return document.title;
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.name)
            this.levelList = matched;
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
    .title {
        color: #303133;
        cursor: text;
        font-weight: 700;
    }
}
</style>
