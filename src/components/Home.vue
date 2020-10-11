<template>
    <el-container class="home-container">
        <!-- 头部区域-->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="" class="home-logo">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <!-- 页面主体区域-->
        <el-container>
            <!-- 侧边栏-->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域-->
                <!-- :router => 为整个侧边栏开启路由模式 -->
                <el-menu
                    background-color="#333744"
                    text-color="#ffffff"
                    active-text-color="#409EFF"
                    :unique-opened="true"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                >
                    <!-- 一级菜单-->
                    <el-submenu :index="item.id + ''" v-for="(item, index) in menuList" :key="item.id">
                        <!-- 一级菜单模板区域-->
                        <template slot="title">
                            <i :class="iconsList[index]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单-->
                        <el-menu-item
                            :index="'/' + subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 页面右侧主体-->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'Home',
        data: function () {
            return {
                // 左侧菜单数据
                menuList: [],
                iconsList: [
                    'el-icon-s-opportunity',
                    'el-icon-s-data',
                    'el-icon-s-check',
                    'el-icon-s-custom',
                    'el-icon-s-claim'
                ],
                isCollapse: false,
                // 左侧导航栏被激活的连接地址
                activePath: ''
            }
        },
        created: function () {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout: function () {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            getMenuList: async function () {
                const { data: res } = await this.$http.get('menus')
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.menuList = res.data
                console.log(res)
            },
            // 点击按钮，切换菜单的折叠和展开
            toggleCollapse: function () {
                this.isCollapse = !this.isCollapse
            },
            // 保存链接的激活状态（即记忆上次的左侧导航打开状态）
            saveNavState: function (activePath) {
                window.sessionStorage.setItem('activePath', activePath)
                this.activePath = activePath
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-header {
        display: flex;
        justify-content: space-between;
        /*align-items: center;*/
        padding-left: 0;
        background-color: #373d41;
        font-size: 20px;
        color: #ffffff;

        span {
            margin-left: 15px;
        }

        img {
            height: 100%;
            vertical-align: middle;
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .home-container {
        height: 100%;
    }

    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #ffffff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
