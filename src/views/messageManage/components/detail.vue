<template>
    <div id="DealersDetail" class="details-container">
        <el-tabs v-model="activeTab">
            <el-tab-pane v-for="tab in tabsConfig.filter(i => !i.hidden)" :key="tab.prop" :label="tab.title" :name="tab.prop" :disabled="tab.disabled">
                <component :ref="tab.prop" :is="tab.componentName" :type="type" :id="id" @closeAndRoute="closeAndRoute" :addType="addType" :commonPromise="commonPromise"></component>
            </el-tab-pane>
        </el-tabs>
        <div class="footer" v-if="['basicInfo', 'billingInfo'].includes(activeTab)">
            <el-button @click="closeAndRoute()" v-if="type === 'view'">返 回</el-button>
            <el-button @click="handleCancel" v-if="type !== 'view'">取 消</el-button>
            <el-button type="primary" @click="submitDialogShow" v-if="type !== 'view'">定时发送</el-button>
            <el-button type="primary" :loading="loading" @click="submitAndContinue" v-if="type !== 'view'">立即发送</el-button>
        </div>
    </div>
</template>
<script>
import BasicInfo from './BasicInfo';
import { detailsTabsConfig } from './config';
export default {
    name: 'DealersDetail',
    components: {
        BasicInfo
    },
    props: {
        /**
         * 类型 add-新增 update-编辑 view-查看
         */
        type: {
            type: String,
            default: 'view'
        },
    },
    data() {
        return {
            tabsConfig: [], // tab 配置表
            id: '', // 消息 ID
            activeTab: 'basicInfo', // 当前活跃 tab
            loading: false, // 提交按钮 loading
            timeLoading:false,
            commonPromise: { // 公共 promise
                dealerGradesPromise: null, // 经销商等级 promise
                accountManagersPromise: null, // 字典列表 promise
            },
            addType:'',  //新增消息方式
        }
    },
    created() {
        const { addType } = this.$route.query;
        const { id } = this.$route.params;
        this.id = id;
        this.addType = addType
    },
    activated() {
        const { meta, query } = this.$route;
        if (meta.new) {
            this.initData();
            // if (query.activeTab) {
            //     this.activeTab = query.activeTab;
            // }
        }
        
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo;
        }
    },
    methods: {
        /**
         * 初始化数据
         */
        initData() {
            this.tabsConfig = [];
            this.activeTab = 'basicInfo';
            setTimeout(() => {
                this.tabsConfig = JSON.parse(JSON.stringify(detailsTabsConfig));
            })
        },
        /**
         * 提交数据并进行下一步
         * @param {string} type next 时跳转至下一个 tab，否则直接返回列表
         */
        submitAndContinue(type) {
            const ref = this.$refs[this.activeTab][0];
            this.loading = true;
            ref && ref.submit('立即发送',id => {
                this.loading = false;
                this.closeAndRoute();
            }, () => {
                this.loading = false;
            })
        },  
        /**
         * 定时发送出现选择时间弹窗
         */
        submitDialogShow(type){
            const ref = this.$refs[this.activeTab][0];
            this.timeLoading = true;
            ref && ref.showTimeSend(id => {
                this.timeLoading = false;
                this.closeAndRoute();
            }, () => {
                this.timeLoading = false;
            })
        },
        /**
         * 关闭当前页面并跳转至列表页
         */
        closeAndRoute(params = {}) {
            this.$store.dispatch('delCurrentVisitedViews', this.$route).then(res => {
                const { path, query } = params;
                console.log(params)
                setTimeout(() => {
                    this.$router.push({
                        path: path || '/message/list',
                        query
                    })
                });
            })
        },
        /**
         * 点击取消
         */
        handleCancel() {
            this.$confirm('当前内容未保存，请确认是否取消保存', '提示', { type: 'warning' }).then(_ => {
                this.closeAndRoute();
            }).catch(_ => {});
        }
    }
}
</script>
<style lang="scss">
#DealersDetail {
    .filter-button--add {
        float: right;
        margin-right: 20px;
        margin-bottom: 20px;
        min-height: 22px;
        min-width: 150px;
    }
}
</style>