import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/permission/Rights.vue'
import Roles from '../components/permission/Roles.vue'
import Cate from '../components/goods/Cate.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                }, {
                    path: '/users',
                    component: Users
                }, {
                    path: '/rights',
                    component: Rights
                }, {
                    path: '/roles',
                    component: Roles
                }, {
                    path: '/categories',
                    component: Cate
                }
            ]
        }
    ]
})

// ** 挂载路由导航守卫 (中间件middleware) **
router.beforeEach((to, from, next) => {
    // to:将要访问的路径
    // from:从哪个路径跳转而来
    // next:一个函数，代表放行(无参)或强制跳转(有参)
    if (to.path === '/login') {
        // 未登录，但访问登录页，直接放行
        return next()
    }
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        return next('/login')
    }
    // 有token（登录状态访问含权限页面），放行
    next()
})

export default router
