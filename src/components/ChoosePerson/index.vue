<template>
    <div id="ChoosePerson">
        <BaseDialog :refs="$refs" :config="dialogConfig" @handleConfirm="handleConfirm" @handleClose="handleClose">
            <div class="wrap" slot="dialog-content">
                <section class="left">
                    <div class="initial" v-if="notDepthJudge">
                        <div class="title">大益集团</div>
                        <div class="selectBar" v-for="item in typeList" @click="selectBar(item)" :key="item.id">
                            <div class="typeCate">{{ item }}</div>
                            <div class="lowerIcon">下级<svg-icon iconClass="xiaji"></svg-icon>
                            </div>
                        </div>
                    </div>
                    <div class="variation" v-else>
                        <div class="small-title" @click="notDepthJudge = true">
                            <i class="el-icon-arrow-left"></i> {{ currentType }}
                        </div>
                        <div class="breadcrumb">
                            <div v-for="(ele, i) in breadList" :class="`${breadList.length === i + 1 ? 'unclick' : 'breadcrumbItem'} `" @click="jumpToList(i)" :key="ele.id">
                                {{ i != 0 ? ' / ' : '' }}{{ ele.name }}
                            </div>
                        </div>
                        <div class="selectItem" @click="selectAll">
                            <div>
                                <CircleSelect :selected="allSelected" class="circleSelect" />
                            </div>
                            <div style="padding-left: 5px">全选</div>
                        </div>
                        <div class="selectList" v-for="(ele, index) in currentList" :key="ele.id">
                            <div class="selectItem">
                                <div @click="selectItem(index)">
                                    <CircleSelect :selected="ele.selected" class="circleSelect" />
                                </div>
                                <div :class="`${ele.selected ? 'grey' : ''} groupName`" @click="selectItem(index)">
                                    {{ ele.name }}
                                </div>
                                <div :class="`${ele.selected ? 'unclick' : 'lowerIcon'}`" @click="expandList(index, ele.selected)" v-if="(ele.children&&ele.children.length != 0)|| (ele.users&&ele.users.length != 0)">
                                    下级
                                    <svg-icon iconClass="xiaji"></svg-icon>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <section class="right">
                    <el-select v-model="value" @change="selectChange" filterable remote reserve-keyword class="search-bar" placeholder="搜索姓名" :remote-method="remoteMethod" :loading="loading">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-tag v-for="tag in tagList" :key="tag" closable @close="closeTag(tag)" type="info" style="margin-right: 5px;margin-bottom: 5px;">
                        {{ tag.name }}
                    </el-tag>
                </section>
            </div>
        </BaseDialog>
    </div>
</template>

<script>
import BaseDialog from '../BaseDialog';
import CircleSelect from './CircleSelect';
import { getQueryUser, getOrgUserTree, getUserListByIds } from '@/api/components/ChoosePerson'
export default {
    name: 'groupChoose',
    components: {
        BaseDialog,
        CircleSelect
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        ids: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            typeList: ['按组织架构选择'],
            currentType: '', // 当前选择类型
            currentList: [], // 当前组织列表
            notDepthJudge: true,
            breadList: [], // 面包屑列表
            tagList: [], // 右侧列表
            options: [],
            loading: false,
            value: null,
            orgData: [], // 组织列表
            userIds: [], // 用户 IDs
            userList: [], // 用户列表
            dialogConfig: {
                show: false,
                width: '880px',
                appendToBody: true,
                title: '选择用户',
            }
        }
    },
    watch: {
        show(value) {
            this.dialogConfig.show = value;
            if (value) {
                this.initData();
            }
        },
        ids(value) {
            this.userIds = JSON.parse(JSON.stringify(value));
            this.fetchData();
        }
    },
    computed: {
        allSelected() {
            let judge = true
            this.currentList.forEach((ele) => {
                if (ele.selected != true) {
                    judge = false
                }
            })
            return judge
        }
    },
    // created() {
    //     this.initData();
    //     this.getOrgData();
    // },
    methods: {
        initData() {
            this.notDepthJudge = true
            this.tagList = [];
            this.getOrgData();
        },
        /**
         * 获取组织信息
         */
        getOrgData() {
            getOrgUserTree({}).then((res) => {
                this.orgList = res;
                this.currentList = this.orgList;
            })
        },
        selectBar(item) {
            // 选最外层的条
            this.currentType = item;
            this.currentList = this.orgList;
            this.notDepthJudge = !this.notDepthJudge;
            this.breadList = [];
        },
        selectItem(item) {
            // 选列表中的一个
            const tag = this.currentList[item]
            this.$set(tag, 'selected', tag.selected !== true)
            if (this.currentList[item].selected === true) {
                this.changeTagList('add', tag);
            } else {
                this.changeTagList('remove', tag);
            }
        },
        selectAll() {
            // 全选
            if (this.allSelected) {
                this.currentList.forEach((ele) => {
                    this.$set(ele, 'selected', false)
                    this.changeTagList('remove', ele);
                })
            } else {
                this.currentList.forEach((ele) => {
                    if (!ele.selected) {
                        this.$set(ele, 'selected', true);
                        this.changeTagList('add', ele);
                    }
                })
            }
        },
        closeTag(tag) {
            this.changeTagList('remove', tag);
        },
        /**
         * 递归取消勾选
         */
        recurveCancel(data, tag) {
            for (var i in data) {
                const prop = tag.id ? 'id' : 'userId';
                if (data[i][prop] == tag[prop]) {
                    data[i].selected = false
                } else {
                    if (data[i].children) {
                        this.recurveCancel(data[i].children, tag)
                    }
                    if (data[i].users) {
                        this.recurveCancel(data[i].users, tag)
                    }
                }
            }
        },
        /**
         * 递归勾选
         */
        recurveSelect(data, tag) {
            for (var i in data) {
                const prop = tag.id ? 'id' : 'userId';
                if (data[i][prop] == tag[prop]) {
                    data[i].selected = true;
                } else {
                    if (data[i].children) {
                        this.recurveSelect(data[i].children, tag)
                    }
                    if (data[i].users) {
                        this.recurveSelect(data[i].users, tag)
                    }
                }
            }
        },
        expandList(index, b) {
            // 下一级
            if (b) {
                return
            }
            this.breadList.push({
                name: this.currentList[index].name,
                index: index
            })
            this.currentList = [].concat(this.currentList[index].children, this.currentList[index].users)

        },
        jumpToList(i) {
            // 面包屑点击到列表
            this.breadList = this.breadList.slice(0, i + 1)
            this.currentList = this.breadList.reduce((nowObj, current) => {
                nowObj = [].concat(nowObj[current.index].children, nowObj[current.index].users)
                return nowObj
            }, this.orgList)
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true
                getQueryUser({
                    name: query
                }).then(result => {
                    this.loading = false
                    this.options = result.records.map(ele => ({
                        name: ele.name,
                        id: ele.id
                    }))
                })
            } else {
                this.options = []
            }
        },
        selectChange(v) {
            this.value = null
            this.options.forEach(ant => {
                if (ant.id == v) {
                    const { id, name } = ant;
                    const index = this.tagList.findIndex(item => item.userId == ant.id);
                    if (index == -1) {
                        const tag = {
                            id: '',
                            name,
                            userId: id
                        }
                        this.changeTagList('add', tag);
                    }
                }
            })
        },
        changeTagList(type, tag) {
            const prop = tag.id ? 'id' : 'userId';
            const index = this.tagList.findIndex(item => item[prop] == tag[prop]);
            if (type == 'add' && index == -1) {
                this.tagList.push(tag);
                this.recurveSelect(this.orgList, tag);
            } else if (type == 'remove' && index > -1) {
                this.tagList.splice(index, 1);
                this.recurveCancel(this.orgList, tag)
            }
        },
        /**
         * 获取选中的用户
         */
        handleConfirm() {
            this.getUserList(this.orgList);
            this.getUser(this.orgList);
            this.userIds = [...new Set(this.userIds)];
            this.fetchData().then(res => {
                this.dialogConfig.show = false;
                this.$emit('submit', { ids: this.userIds });
            });
        },
        /**
         * 获取选中用户
         */
        getUserList(data, judge = false) {
            // 获取用户列表  judge用来判断父节点选中后, 子节点的user都要加到列表里
            for (var ele of data) {
                if (judge) {
                    for (var ant of ele.users) {
                        this.userIds.push(ant.userId)
                    }
                } else if (ele.selected === true) {
                    for (var tnt of ele.users) {
                        this.userIds.push(tnt.userId)
                    }
                }
                if (ele.children) {
                    if (judge || ele.selected === true) {
                        this.getUserList(ele.children, true)
                    } else {
                        this.getUserList(ele.children)
                    }
                }
            }
        },
        /**
         * 获取选中用户
         */
        getUser(data) {
            for (var ele of data) {
                for (var ant of ele.users) {
                    if (ant.selected === true) {
                        this.userIds.push(ant.userId)
                    }
                }
                if (ele.children) {
                    this.getUser(ele.children)
                }
            }
        },
        /**
         * 获取用户列表
         */
        fetchData() {
            return new Promise(resolve => {
                getUserListByIds({
                    userIds: this.userIds,
                    pageNo: 1,
                    pageSize: 99999
                }).then((res) => {
                    this.userList = (res || {}).records || [];
                    this.$emit('submit', { list: this.userList })
                    resolve(this.userList);
                })
            })
        },
        /**
         * 关闭弹窗
         */
        handleClose() {
            this.$emit('submit');
        },
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
}

.circleSelect {
    width: 20px;
    height: 20px;

    /deep/ .svg-icon {
        width: 20px;
        height: 20px;
    }
}

.title {
    font-size: 18px;
    margin-bottom: 10px;
}

.unclick {
    //pointer-events: none;
    cursor: not-allowed;
    margin-left: 10px;
    color: #bfbfbf;
}

.grey {
    color: #ccc;
}

.small-title {
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}

.wrap .left,
.right {
    flex: 1;
    padding: 20px 25px;
    max-height: 300px;
    overflow-y: scroll;
}

.left {
    border-right: 1px solid #ccc;
}

.selectBar {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    &:hover {
        background: #e8e8e8;
    }
}

.selectItem {
    padding: 5px;

    display: flex;
    cursor: pointer;

    &:hover {
        background: #f5f2f2;
    }
}

.groupName {
    margin-left: 5px;
    flex: 4;
    border-right: 1px solid #ccc;
}

.lowerIcon {
    margin-left: 10px;

    &:hover {
        color: #0065b8;
    }
}

.breadcrumb {
    padding-left: 18px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
}

.breadcrumbItem {
    margin-right: 5px;
    cursor: pointer;

    &:hover {
        color: #0065b8;
    }
}
.search-bar {
    width: 350px;
    /deep/ .el-input__inner {
        border: none;
        padding: 0;
    }
}
</style>
