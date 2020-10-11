<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table :data="roleList" :border="true" :stripe="true">
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot="{ row }">
                        <el-row
                            v-for="(item1, ind1) in row.children"
                            :key="item1.id"
                            :class="['bd-bottom', ind1 === 0 ? 'bd-top' : '', 'vcenter']"
                        >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag :closable="true" @close="removeRightById(row, item1.id)">
                                    {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row
                                    v-for="(item2, ind2) in item1.children"
                                    :key="item2.id"
                                    :class="[ind2 === 0 ? '' : 'bd-top', 'vcenter']"
                                >
                                    <el-col :span="6">
                                        <el-tag type="success" :closable="true" @close="removeRightById(row, item2.id)">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            v-for="item3 in item2.children"
                                            type="warning"
                                            :key="item3.id"
                                            :class="['']"
                                            :closable="true"
                                            @close="removeRightById(row, item3.id)"
                                        >
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template v-slot="{ row }">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="30%"
            @close="setRightDialogClosed"
        >
            <!-- 树形控件 -->
            <el-tree
                ref="treeRef"
                :data="rightsList"
                :props="treeProps"
                :show-checkbox="true"
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="defKeys"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allocRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Roles',
        data: function () {
            return {
                roleList: [],
                // 弹出的修改权限对话框是否可见
                setRightDialogVisible: false,
                // 树形权限数据列表
                rightsList: [],
                // 树形控件的属性绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 默认选中的节点id值
                defKeys: [],
                // 当前即将分配权限的角色id
                roleId: ''
            }
        },
        created () {
            this.getRolesList()
        },
        methods: {
            getRolesList: async function () {
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败！')
                }
                this.roleList = res.data
                console.log(this.roleList)
            },
            // 根据id删除对应的权限
            removeRightById: async function (role, rightId) {
                // 弹框提示是否要删除
                const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '删除权限', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败！')
                }
                role.children = res.data
            },
            // 展示分配权限的对话框
            showSetRightDialog: async function (role) {
                this.roleId = role.id
                // 获取所有权限数据
                const { data: res } = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限数据失败！')
                }
                // 获取到的权限数据保存到data中
                this.rightsList = res.data
                // 递归获取三级节点的id
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisible = true
            },
            // 通过**递归**形式获取角色下所有三级权限的id并保存到数组中
            getLeafKeys: function (node, arr) {
                // 如果当前node节点不包含children属性，则为三级节点(递推终点)
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })
            },
            // 监听分配权限对话框的关闭事件
            setRightDialogClosed: function () {
                this.defKeys = []
            },
            // 点击为角色分配权限
            allocRights: async function () {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idStr = keys.join(',')
                const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
                if (res.meta.status !== 200) {
                    return this.$message.error('分配角色权限失败！')
                }
                this.$message.success('分配权限成功！')
                await this.getRolesList()
                this.setRightDialogVisible = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bd-top {
        border-top: 1px solid #eeeeee;
    }

    .bd-bottom {
        border-bottom: 1px solid #eeeeee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>
