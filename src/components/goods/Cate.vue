<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->

            <!-- 分页区域 -->

        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'Cate',
        data: function () {
            return {
                // 商品分类信息查询条件
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pageSize: 5
                },
                // 商品分类的数据列表
                cateList: [],
                // 总数据条数
                total: 0
            }
        },
        created () {
            this.getCateList()
        },
        methods: {
            // 获取商品分类数据
            getCateList: async function () {
                const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类信息失败！')
                }
                this.cateList = res.data.result
                this.total = res.data.total
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
