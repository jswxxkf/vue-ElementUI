<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加区域 -->
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        :clearable="true"
                        @clear="getUserList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" :border="true" :stripe="true">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- *** 作用域插槽，让当前组件能够复用子组件中的数据，以渲染特定页面 (数据双向流动) ***-->
                    <!-- 从slotProps中解构出row -->
                    <template v-slot="{ row }">
                        <el-switch v-model="row.mg_state" @change="userStateChanged(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template v-slot="{ row }">
                        <!-- 修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeUserById(row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <!-- enterable:false => 鼠标进入tips后消失 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="setRole(row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="30%"
            @close="addDialogClosed"
        >
            <!-- 内容主体区 -->
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="30%"
            @close="editDialogClosed"
        >
            <el-form
                :model="editForm"
                :rules="addFormRules"
                ref="editFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogClosed">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="30%"
        >
            <div>
                <p>当前的用户：{{ userInfo.username }}</p>
                <p>当前的角色：{{ userInfo.role_name }}</p>
                <p>
                    分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择新角色">
                        <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Users',
        data: function () {
            // 验证邮箱的规则
            const checkEmail = (rule, value, cb) => {
                // 验证邮箱的RegExp
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return cb()
                }
                cb(new Error('请输入合法的邮箱！'))
            }
            // 验证手机号的规则
            const checkMobile = (rule, value, cb) => {
                // 验证手机号的RegExp
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的手机号！'))
            }
            return {
                // 获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    // 分的页数
                    pagenum: 1,
                    // 当前每页显示多少条数据
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                // 控制添加用户对话框的显示与隐藏
                addDialogVisible: false,
                // 添加用户的表单数据
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 添加用户表单规则对象
                addFormRules: {
                    username: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: '用户名必须在3-10个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '密码长度在6-15位之间',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            message: '请输入邮箱',
                            trigger: 'blur'
                        },
                        {
                            validator: checkEmail,  // 自定义校验规则
                            trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号',
                            trigger: 'blur'
                        },
                        {
                            validator: checkMobile,
                            trigger: 'blur'
                        }
                    ]
                },
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible: false,
                // 编辑时查询到的用户信息对象
                editForm: {},
                // 控制分配角色对话框的显示与否
                setRoleDialogVisible: false,
                // 需要被分配角色的用户信息
                userInfo: {},
                // 所有角色的数据列表
                rolesList: [],
                // 已选中的角色id值
                selectedRoleId: ''
            }
        },
        created () {
            this.getUserList()
        },
        methods: {
            getUserList: async function () {
                const { data: res } = await this.$http.get('users', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败！')
                }
                console.log(res)
                this.userlist = res.data.users
                this.total = res.data.total
            },
            // 监听pagesize改变的事件
            handleSizeChange: function (newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            // 监听页码值改变的事件
            handleCurrentChange: function (newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            // 更新用户状态
            userStateChanged: async function (userInfo) {
                const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功！')
            },
            // 监听添加用户对话框的关闭事件
            addDialogClosed: function () {
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加新用户
            addUser: function () {
                // 提交前整体再验证一次
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    // 可以发起添加用户的AJAX请求
                    const { data: res } = await this.$http.post('users', this.addForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加用户失败！')
                    }
                    this.$message.success('添加用户成功！')
                    // 隐藏添加用户的对话框
                    this.addDialogVisible = false
                    // 重新获取列表数据
                    await this.getUserList()
                })
            },
            // 展示编辑用户对话框
            showEditDialog: async function (userId) {
                this.editDialogVisible = true
                const { data: res } = await this.$http.get('users/' + userId)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败！')
                }
                this.editForm = res.data
            },
            editDialogClosed: function () {
                this.$refs.editFormRef.resetFields()
            },
            // 修改用户信息并提交
            editUserInfo: function () {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    // 发起修改用户信息的AJAX请求
                    const { data: res } = await this.$http.put(
                        `users/${this.editForm.id}`,
                        {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        })
                    if (res.meta.status !== 200) {
                        this.$message.error('更新用户信息失败！')
                    }
                    // 关闭修改对话框
                    this.editDialogVisible = false
                    // 刷新数据列表
                    await this.getUserList()
                    // 提示修改成功
                    this.$message.success('更新用户信息成功！')
                })
            },
            // 根据id删除用户
            removeUserById: async function (userId) {
                // 弹框询问是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                // 点击确认删除，则返回confirm，反之，返回cancel
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已确认删除')
                }
                const { data: res } = await this.$http.delete('users/' + userId)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除用户失败！')
                }
                this.$message.success('删除用户成功！')
                await this.getUserList()
            },
            // 展示分配角色的对话框
            setRole: async function (userInfo) {
                this.userInfo = userInfo
                // 在展示对话框之前，获取所有角色列表
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败！')
                }
                this.rolesList = res.data
                this.setRoleDialogVisible = true
            },
            // 点击按钮分配角色
            saveRoleInfo: async function () {
                if (!this.selectedRoleId) {
                    return this.$message.error('请选择要分配的角色！')
                }
                const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
                if (res.meta.status !== 200) {
                    this.$message.error('修改分配角色失败！')
                }
                this.$message.success('更新角色成功！')
                this.setRoleDialogVisible = false
                await this.getUserList()
            },
            // 监听分配角色对话框的关闭事件
            setRoleDialogClosed: function () {
                this.selectedRoleId = ''
                this.userInfo = {}
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
