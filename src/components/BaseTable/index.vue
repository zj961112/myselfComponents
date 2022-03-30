<template>
    <div id="BaseTable">
        <div ref="indexTable">
            <el-table ref="multipleTable" :height="defaultHeight || height" :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row @sort-change="sortData" style="width: 100%;" header-cell-class-name="table-header" tooltip-effect="dark">
                <el-table-column :align="column.align || 'center'" :label="column.label" :prop="column.prop" :sortable="column.sortable ? 'custom' : false" :key="column.prop" :width="column.width" :fixed="column.fixed" :show-overflow-tooltip="column.showOverflowTooltip" class-name="table-column-class" v-for="column in tableColumns.filter(i => !i.hidden)">
                    <template slot-scope="scope" v-if="column.type !== 'selection'">
                        <!-- 自定义插槽，当isSlot为true时显示 -->
                        <slot :name="'column-'+column.prop" :index="scope.$index" :row="scope.row" v-if="column.isSlot"></slot>
                        <div v-else-if="column.isIndex">{{scope.$index + 1}}</div>
                        <!-- 列表返回类型code时使用，当isTypecode为true时显示 -->
                        <div v-else-if="column.isTypecode">
                            <span>{{getNames(column, scope)}}</span>
                        </div>
                        <!-- 列表具备点击操作功能时使用，当isClick为true时显示 -->
                        <div v-else-if="column.isClick">
                            <a href="#" style="color: #409EFF" @click.prevent="clickCallback(column, scope.row)">{{scope.row[column.prop]}}</a>
                        </div>
                        <!-- 常规数据显示 -->
                        <div v-else>
                            <span>{{scope.row[column.prop]}}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" ref="pages" v-if="showPages">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pages.pageNum" :page-sizes="[10, 20, 50, 100, 500]" :page-size="pages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'BaseTable',
    props: {
        // 数据列表
        list: {
            type: Array,
            default() { }
        },
        // 传入的列表参数
        tableColumns: {
            type: Array,
            default() { }
        },
        // 是否展示分页组件，默认展示
        showPages: {
            type: Boolean,
            default: true
        },
        // 列表是否自适应高度，默认自适应
        autoHeight: {
            type: Boolean,
            default: true
        },
        // 分页参数
        pages: {
            type: Object,
            default() {
                return {
                    total: 0, // 分页总数
                    pageSize: 20, // 每页条数
                    pageNum: 1, // 当前页数
                    sortName: '', // 排序字段
                    sortType: '' // 排序类型，ase正序，desc倒序
                }
            }
        },
        // 初始化 table 高度
        defaultHeight: {
            type: [Number],
            default: null
        }
    },
    data() {
        return {
            height: null, // table组件高度
            boxTop: '', // table组件离页面顶部距离
            listLoading: false, // table组件loading
        }
    },
    created() {
        this.layOut();
    },
    mounted() {
        this.boxTop = this.$refs.indexTable.getBoundingClientRect().top;
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    activated() {
        this.handleResize();
        this.layOut();
    },
    methods: {
        /**
         * 监听浏览器尺寸变化
         */
        handleResize() {
            if (this.autoHeight) {
                this.height = document.documentElement.clientHeight - this.boxTop - 50;
            }
        },
        /**
         * 对table组件进行重新布局
         */
        layOut() {
            setTimeout(() => {
                this.$refs['multipleTable'] && this.$refs['multipleTable'].doLayout()
            }, 0)
        },
        /*
         * 点击查询按钮时调用上级查询函数
         */
        fetchData() {
            this.listLoading = true;
            this.$emit('fetchData', this.pages, () => {
                this.listLoading = false;
            });
        },
        /*
         * 当 column.isTypecode 为 true 时，根据传入的 column 的 codeKey 进行匹配，返回 nameKey 或 nameKey 的集合
         * @param {object} column 当前列的配置
         * @param {object} scope 当前列数据
         * 
         */
        getNames(column, scope) {
            const { prop, list, codeKey, nameKey, isMultiple } = column;
            const values = scope.row[prop] || '';
            const _codeKey = codeKey || 'code',
                _nameKey = nameKey || 'name';
            let name = '';
            if (isMultiple) {
                values.split(',').forEach((value, index) => {
                    name = `${name}${index == 0 ? '' : ','}${(list.find(x => x[_codeKey] == value) || {})[_nameKey]}`;
                })
            } else {
                name = (list.find(x => x[_codeKey] == scope.row[prop]) || {})[_nameKey];
            };
            return name;
        },
        /*
         * 当column.isClick为true时调用clickCallback回调函数
         * @param {object} column 当前列的配置
         * @param {object} row 当前行数据
         */
        clickCallback(column, row) {
            const { clickCallback } = column;
            if (clickCallback && typeof clickCallback === 'function') {
                clickCallback(column, row);
            }
        },
        /*
         * 列表排序时调用函数
         * @param {object} val table组件排序参数
         */
        sortData(val) {
            this.pages.sortName = val.prop;
            this.pages.sortType = val.order == 'ascending' ? 'asc' : 'desc';
            this.fetchData();
        },
        /*
         * 分页size改变时调用函数
         * @param {number} val size的值
         */
        handleSizeChange(val) {
            this.pages.pageSize = val;
            this.fetchData();
        },
        /*
         * 分页当前页数改变时调用函数
         * @param {number} val pageNum
         */
        handleCurrentChange(val) {
            this.pages.pageNum = val;
            this.fetchData();
        },
    }
}
</script>
<style lang="scss">
#BaseTable {
    padding: 0 20px 20px 20px;
    .table-header {
        background-color: #fafafa;
    }
}
</style>