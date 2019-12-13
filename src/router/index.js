import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/account/Login.vue')
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('../views/account/Index.vue')
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('../views/order/List.vue')
  },
  {
    path: '/order/create',
    name: 'OrderCreate',
    component: () => import('../views/order/Create.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/errors/404.vue')
  },
  {
    path: '',
    redirect: '/order/list',
    hidden: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
