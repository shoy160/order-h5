import Vue from 'vue'
// import './utils/vconsole'
import App from './App.vue'
import router from './router'
import store from './store'

import * as filters from './filters' // global filters

// 权限验证
// import './router/permission'

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
