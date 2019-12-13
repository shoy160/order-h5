import router from './index'
import store from '../store'
import { getTicket } from '../utils/auth'

const whiteList = ['Login', 'NotFound']

router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.name) >= 0) {
    // 在白名单
    next()
    return
  }
  var token = getTicket()
  if (!token) {
    next({
      replace: true,
      path: '/login'
    })
    return
  }
  if (store.getters.userId) {
    next()
  } else {
    store.dispatch('updateUser').then(() => {
      next()
    })
  }
})
