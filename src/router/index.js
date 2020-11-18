import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/Home'
import Welcome from '../views/Welcome'
import Users from '../views/Users'
import Right from '../views/Rights'
import Roles from '../views/Roles'
import Cate from '../views/Cate'
import Params from '../views/Params'
import GoodList from '../views/Goods'
import AddGood from '../views/AddGood'
import EditGood from '../views/EditGood'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: '/home/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Right
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodList
      },
      {
        path: '/goods/addgood',
        component: AddGood
      },
      {
        path: '/goods/editgood',
        component: EditGood
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
