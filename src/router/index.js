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
    path: '/',
    name: 'Home',
    redirect: { name: 'OrderList' }
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('../views/order/List.vue')
  },
  {
    path: '/order/draft',
    name: 'OrderDraft',
    component: () => import('../views/order/Draft.vue')
  },
  {
    path: '/order/create',
    name: 'OrderCreate',
    component: () => import('../views/order/create/Index.vue')
  },
  {
    path: '/order/edit/:id',
    name: 'OrderEdit',
    component: () => import('../views/order/create/Index.vue')
  },
  {
    path: '/order/draft/:draftId',
    name: 'OrderDraftEdit',
    component: () => import('../views/order/create/Index.vue')
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('../views/order/Detail.vue')
  },
  {
    path: '/dashdoard',
    name: 'Dashdoard',
    component: () => import('../views/dashdoard/Index.vue')
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/errors/404.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
