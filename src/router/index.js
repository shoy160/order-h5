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
    path: '/order',
    name: 'OrderList',
    component: () => import('../views/order/List.vue')
  },
  {
    path: '/order/create',
    name: 'OrderCreate',
    component: () => import('../views/order/Create.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
