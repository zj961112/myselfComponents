<template>
    <div id="GoodsList">
        <!-- 查询条件组件 -->
        <BaseFilter :conditions="filterParams" addBtnText="新增消息" @fetchData="fetchData" @add="handleAdd"></BaseFilter>
        <!-- table 列表组件 -->
        <BaseTable :list="list" :tableColumns="tableColumns" :pages="pages" @fetchData="fetchData">
            <span slot="column-operation" slot-scope="scope">
                <el-button type="text" @click="handleUpdate('view', scope.row)">查看</el-button>
                <el-button v-if="scope.row.state === 0" type="text" @click="handleCancel(scope.row)">取消发送</el-button>
            </span>
            
        </BaseTable>
        <!-- 表单弹窗组件 -->
        <FormDialog :refs="$refs" :dialogConfig="dialogConfig" :formData="formData" @submit="handleSubmit"></FormDialog>
    </div>
</template>
<script>
import { BaseFilter, BaseTable,FormDialog } from '@/components/index';
import { flattenObject } from '@/utils/formatter';
import { formatDateTime } from '@/utils/date';
import { goodsListFilter, goodsListTableColumns,ListFormData } from './config.js';
import { messageList,templateList,updateState  } from '@/api/message/index';
export default {
    name: 'messgaeIndex',
    components: {
        BaseFilter,
        BaseTable,
        FormDialog
    },
    data() {
        return {
            filterParams: {}, // 筛选条件
            list: [], // 数据列表
            tableColumns: [], // table列信息
            pages: { // 分页参数
                pageNum: 1, // 页数
                pageSize: 20, // 每页数量
                total: 0, // 总数
            },
            dialogConfig:{}, // 弹窗配置信息
            formData: {}, // 表单数据
        }
    },
    created() {
        // 初始化数据
        this.initData();
    },
    activated() {
        // 获取列表数据
        this.fetchData();
        this.getTemplateList()
    },
    methods: {
        /**
         * 初始化数据
         */
        initData() {
            this.filterParams = Object.assign({}, goodsListFilter);
            this.tableColumns = goodsListTableColumns;
            this.dialogConfig = {
                show: false,
                title: '新增商品',
                type: 'add'
            };
            this.formData = Object.assign({}, new ListFormData());
        },
        /**
         * 获取应用模版数据
         */
        getTemplateList(){
            let params = {
                //state:1,
            }
            templateList(params).then(res => {
                this.filterParams.bizTemplateId.selectList=res || []
                this.tableColumns[2].list = res || []
            })
        },
        /**
         * 获取数据
         * @params {object} pages 分页参数
         * @params {function} callback 回调函数
         */
        fetchData(pages = {}, callback) {
            const { title, channel, state, bizTemplateId, createUser, datetime } = flattenObject(this.filterParams);
            this.pages = Object.assign(this.pages, pages);
            const { pageNum, pageSize } = this.pages;
            let params = {
                title,
                channel,
                state,
                bizTemplateId,
                createUser,
                sendStartTime: datetime && formatDateTime(datetime[0], 'start'),
                sendEndTime: datetime && formatDateTime(datetime[1], 'end'),
                current: pageNum,
                size: pageSize
            }
            messageList(params).then(res => {
                const { records, total } = res || {};
                if(records&&records.length>0){
                    for(var i=0;i<records.length;i++){
                        if(records[i].channels&&records[i].channels.length>0){
                            records[i].channel = records[i].channels.join(',')
                        }else{
                            records[i].channel = ''
                        }
                        if(records[i].bizTemplateIds&&records[i].bizTemplateIds.length>0){
                            records[i].bizTemplateId = records[i].bizTemplateIds.join(',')
                        }else{
                            records[i].bizTemplateId= ''
                        }
                    }
                }
                this.list = records || [];
                this.pages.total = total || 0;
                if (callback && typeof callback === 'function') {
                    callback(total);
                }
            })
        },
        /**
         * 打开新增弹窗
         */
        handleAdd() {
            this.dialogConfig.show = true;
            this.dialogConfig.type = 'add';
            this.dialogConfig.title = '新增商品';
        },
        /**
         * 打开编辑弹窗并进行数据回填
         * @params {object} row 当前选中行
         */
        handleUpdate(type, row) {
            const { id,title } = row;
            this.routerGo({
                type: type,
                id,
                name: title
            })
        },
        /**
         * 修改状态
         * @params {object} row 当前选中行
         */
        handleCancel(row) {
            const { id, title } = row;
            this.$confirm(`是否确认取消${title}？`, '提示', { type: 'warning' }).then(_ => {
                updateState({
                    id,
                    state: 4
                }).then(res => {
                    this.$message.success('已取消');
                    this.fetchData();
                })
            }).catch(_ => {});
        },
        routerGo(params = {}) {
            const { type, id, name } = params;
            const path = type == 'add' ? '/message/add' : `/message/${type}/id/${id}`;
            this.$router.push({
                path,
                query: {
                    name,
                    //目前只有模版消息
                    addType:1
                }
            })
        },
        /**
         * 提交表单数据
         * @params {function} done 组件回调事件，关闭弹窗
         */
        handleSubmit(done) {
            this.routerGo({
                type: 'add',
                addType: this.formData.addType.value
            })
            done();
        },
    }
}
</script>
<style lang="scss" scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
    margin-left: 10px;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.el-dropdown-item {
    color: #409EFF;
}
</style>