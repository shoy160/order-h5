import Vue from 'vue'
import axios from 'axios'
import auth from './auth'
import { Toast } from 'vant'
import router from '@/router'

Vue.use(Toast)
Toast.setDefaultOptions('loading', { forbidClick: true, duration: 0 })
// Toast.allowMultiple()

// 创建axios实例
const $axios = axios.create({
  baseURL: process.env.VUE_APP_GATEWAY_HOST, // api的base_url
  timeout: 5 * 60 * 1000 // 请求超时时间
})

// request拦截器
$axios.interceptors.request.use(
  config => {
    var ticket = auth.getTicket()
    if (ticket) {
      config.headers['Authorization'] = `acb ${ticket}`
    } else {
      config.headers['Authorization'] = 'basic h5'
    }
    return config
  },
  error => {
    return Promise.reject({
      status: -1,
      message: error.message
    })
  }
)

// response拦截器
$axios.interceptors.response.use(
  response => {
    // if (response.hasOwnProperty('access_token')) {
    //   // setToken(res['access_token'])
    //   return response
    // }
    var res = response.data
    if (res.hasOwnProperty('status') && !res.status) {
      //Toast(res.message)
      Toast({
        message: res.message,
        position: 'bottom',
        duration: 2000
      })
      if (10005 === res.code || 10006 === res.code) {
        auth.removeTicket()
        router.replace('/login')
      }
      return Promise.reject(res)
    }
    if (res.hasOwnProperty('total') || !res.hasOwnProperty('data')) {
      return res
    }
    return res.data
  },
  error => {
    Toast({
      type: 'fail',
      message: error.message,
      position: 'bottom',
      duration: 2000
    })
    return Promise.reject({
      status: -1,
      message: error.message
    })
  }
)

export default $axios
