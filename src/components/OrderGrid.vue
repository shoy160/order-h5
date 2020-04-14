<template>
  <van-grid :column-num="2">
    <van-grid-item text="订单量">
      <div slot="icon" class="d-number">
        <countTo :startVal="0" :endVal="model.count" :duration="duration" />
      </div>
    </van-grid-item>
    <van-grid-item text="按揭订单">
      <div slot="icon" class="d-number">
        <countTo
          :startVal="0"
          :endVal="model.mortgageCount"
          :duration="duration"
        />
      </div>
    </van-grid-item>
    <van-grid-item text="V2单量">
      <div slot="icon" class="d-number">
        <countTo :startVal="0" :endVal="model.v2Count" :duration="duration" />
      </div>
    </van-grid-item>
    <van-grid-item text="V3单量">
      <div slot="icon" class="d-number">
        <countTo :startVal="0" :endVal="model.v3Count" :duration="duration" />
      </div>
    </van-grid-item>
    <van-grid-item text="实收金额">
      <div slot="icon" class="d-number">
        <countTo
          :startVal="0"
          :endVal="model.paid / 10000.0"
          :duration="duration"
          :decimals="2"
        />
        <span class="d-unit">万元</span>
      </div>
    </van-grid-item>
    <van-grid-item text="承保金额">
      <div slot="icon" class="d-number">
        <countTo
          :startVal="0"
          :endVal="model.insured / 10000.0"
          :duration="duration"
          :decimals="2"
        />
        <span class="d-unit">万元</span>
      </div>
    </van-grid-item>
    <van-grid-item text="成本金额">
      <div slot="icon" class="d-number">
        <countTo
          :startVal="0"
          :endVal="model.cost / 10000.0"
          :duration="duration"
          :decimals="2"
        />
        <span class="d-unit">万元</span>
      </div>
    </van-grid-item>
    <van-grid-item text="利润金额">
      <div slot="icon" class="d-number">
        <countTo
          :startVal="0"
          :endVal="profit"
          :duration="duration"
          :decimals="2"
        />
        <span class="d-unit">万元</span>
      </div>
    </van-grid-item>
  </van-grid>
</template>
<script>
import Vue from 'vue'
import countTo from 'vue-count-to'
import { Grid, GridItem } from 'vant'
Vue.use(Grid).use(GridItem)
export default {
  name: 'OrderGrid',
  components: { countTo },
  props: {
    model: {
      type: Object,
      default() {
        return {
          count: 0,
          v2Count: 0,
          v3Count: 0,
          insured: 0.0,
          paid: 0.0,
          cost: 0.0,
          mortgageCount: 0
        }
      }
    }
  },
  computed: {
    profit() {
      return (this.model.paid - this.model.cost) / 10000.0
    }
  },
  data() {
    return {
      duration: 1500
    }
  },
  mounted() {}
}
</script>
<style>
.van-grid-item__text {
  margin-top: 0.5rem;
}
.d-number {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #555;
}
.d-unit {
  font-size: 80%;
  color: #999;
  margin-left: 0.2rem;
}
</style>
