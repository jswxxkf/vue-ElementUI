<template>
    <div class="login_container">
        <div class="login-box">
            <!-- 头像区域-->
            <div class="avatar-box">
                <img src="../assets/logo.png" alt="avatar">
            </div>
            <!-- 登录表单区域-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item>
                    <el-button type="info" class="btn" @click="resetLoginForm">重置</el-button>
                    <el-button type="primary" class="btn" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data: function () {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules: {
                    // 验证用户名是否合法
                    username: {
                        required: true,
                        message: '请输入登录名',
                        trigger: 'blur'
                    },
                    // 验证密码是否合法
                    password: {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                }
            }
        },
        methods: {
            resetLoginForm: function () {
                // 目的是为了获取到loginFormRef这个表单组件对象，以调用其中的重置表单方法
                this.$refs.loginFormRef.resetFields()
            },
            login: function () {
                // 此处另一种做法是使用await关键字配合async将异步操作转为同步等待，等待post返回响应数据，
                // 而非pending态的Promise对象
                this.$refs.loginFormRef.validate(async valid => {
                    // 先验证表单
                    if (!valid) return
                    // this.$http.post('login', this.loginForm)
                    //     .then(res => {
                    //         console.log(res)
                    //     })
                    const { data: res } = await this.$http.post('login', this.loginForm)
                    if (res.meta.status !== 200)
                        return this.$message.error("登录失败！")
                    this.$message.success('登录成功')
                    // 成功后下一步：将服务器分发的token保存至客户端的sessionStorage中
                    window.sessionStorage.setItem('token', res.data.token)
                    // 通过编程式导航跳转到后台主页，路由地址是 /home
                    await this.$router.push("/home")
                })
            }
        }
    }
</script>

<!--less stands for compile less(leaner)-->
<style lang="less" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
    }

    .login-box {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 450px;
        height: 300px;
        background-color: #ffffff;
        border-radius: 3px;
        transform: translate(-50%, -50%);
    }

    .avatar-box {
        position: absolute;
        left: 50%;
        height: 130px;
        width: 130px;
        padding: 10px;
        border: 1px solid #eeeeee;
        border-radius: 50%;
        box-shadow: 0 0 10px #dddddd;
        transform: translate(-50%, -50%);
        background-color: #ffffff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eeeeee;
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btn {
        float: right;
        margin-left: 20px;
    }
</style>
