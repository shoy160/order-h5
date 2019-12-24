<template>
  <div class="d-breadcrumb">
    <span v-for="(item, index) in data" :key="guid(item)">
      <van-icon v-if="index > 0" name="arrow" />
      {{ item }}
    </span>
  </div>
</template>
<script>
import Vue from 'vue'
import { Icon } from 'vant'
Vue.use(Icon)
var _guid = 1
export default {
  name: 'Breadcrumb',
  props: {
    data: Array
  },
  methods: {
    guid() {
      return _guid++
    }
  }
}
</script>
<style lang="less">
.d-breadcrumb {
  color: #333;
  span {
    vertical-align: middle;
  }
  .van-icon {
    color: #c0c4cc;
    line-height: 1;
    font-weight: 400;
    margin: 0 6px;
    vertical-align: middle;
  }
}
</style>
