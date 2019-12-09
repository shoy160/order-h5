import router from './index'
import store from '../store'
import { getTicket } from '../utils/auth'

const whiteList = ['Login']

router.beforeEach((to, from, next) => {
  var token = getTicket()
  if (whiteList.indexOf(to.name) === -1) {
    // 不在白名单
    if (!token) {
      next({
        replace: true,
        path: '/login'
      })
    } else if (!store.getters.userCode) {
      store.dispatch('updateUser').then(() => {
        next()
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
