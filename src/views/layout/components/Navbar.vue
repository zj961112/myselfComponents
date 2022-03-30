<template>
    <div>
        <el-menu class="navbar" mode="horizontal" style="left: 208px;" v-if="$route.name != 'login' && $route.name != 'error'">
            <Breadcrumb></Breadcrumb>
        </el-menu>
        <div class="userinfo">
            <div class="avatar">
                <i class="el-icon-user"></i>
            </div>
            <el-dropdown class="username pointer" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getUser } from '@/utils/auth';

export default {
    components: {
        Breadcrumb,
        Hamburger
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar'
        ]),
        username: function() {
			return this.$store.getters.userInfo.userName || '用户名';
		},
        nickname: function() {
			return this.$store.getters.userInfo.nickName || '昵称';
		},
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar')
        },
        /**
         * 监听用户点击菜单
         */
        handleCommand(command) {
            if (command === 'logout') {
                this.$store.dispatch('LogOut', process.env.LOGIN_URL);
            } else if (command === 'changePassword') {
                return this.$message.warning('该功能暂未开放，敬请期待');
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 99;
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
}

.userinfo {
    position: absolute;
    height: 50px;
    right: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    .el-icon-bell {
        font-size: 20px;
        cursor: pointer;
    }
    .avatar {
        width: 27px;
        height: 27px;
        margin-left: 20px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #E6E6E6;
        .el-icon-user-solid {
            font-size: 20px;
        }
    }
    .username {
        margin-left: 10px;
        .el-dropdown-link {
            color: #6a7c91;
        }
    }
}
</style>

