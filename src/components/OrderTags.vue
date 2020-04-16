<template>
  <div class="d-tags">
    <van-tag type="primary" plain v-if="model.orderType !== undefined">{{
      model.orderType == 0 ? 'i车保' : '凡车汇'
    }}</van-tag>
    <van-tag color="#ff5400" plain>{{
      model.ownerType == 1 ? '个人' : '企业'
    }}</van-tag>
    <van-tag color="#dd85ee" plain v-if="(model.orderSource & 8) > 0">
      摩托
    </van-tag>
    <van-tag color="#dd85ee" plain v-else>汽车</van-tag>
    <van-tag type="success" plain v-if="model.isElectronPolicy">电子</van-tag>
    <van-tag color="#7232dd" plain v-if="model.isBuyTradition">传统</van-tag>
    <van-tag type="warning" plain v-if="model.isMortgage">按揭</van-tag>
    <van-tag type="danger" plain v-if="model.isUsedCar">二手</van-tag>
    <van-tag color="#85b" plain v-if="(model.orderSource & 32) > 0">
      买赠
    </van-tag>
    <van-tag color="#b58" plain v-if="(model.orderSource & 64) > 0">
      纯赠
    </van-tag>
  </div>
</template>
<script>
import Vue from 'vue'
import { Tag } from 'vant'
Vue.use(Tag)
export default {
  name: 'OrderTags',
  props: {
    model: Object,
  },
}
</script>
<style>
.van-tag {
  margin-right: 0.3rem;
}
.d-tags {
  margin-bottom: 1rem;
}
</style>
