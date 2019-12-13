<template>
  <van-tabbar :value="active" route :z-index="11">
    <van-tabbar-item name="orders" icon="orders-o" to="/order/list"
      >订单</van-tabbar-item
    >
    <van-tabbar-item name="new" icon="plus" to="/order/create"
      >新建</van-tabbar-item
    >
    <van-tabbar-item name="mine" icon="friends-o" to="/mine"
      >我的</van-tabbar-item
    >
  </van-tabbar>
</template>
<script>
import Vue from 'vue'
import { Tabbar, TabbarItem } from 'vant'
Vue.use(Tabbar).use(TabbarItem)
export default {
  name: 'Menus',
  props: {
    active: String
  }
}
</script>
