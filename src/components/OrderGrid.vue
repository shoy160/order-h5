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
      <amountCountTo slot="icon" :amount="model.paid" :duration="duration" />
    </van-grid-item>
    <van-grid-item text="承保金额">
      <amountCountTo slot="icon" :amount="model.insured" :duration="duration" />
    </van-grid-item>
    <van-grid-item text="成本金额">
      <amountCountTo slot="icon" :amount="model.cost" :duration="duration" />
    </van-grid-item>
    <van-grid-item text="利润金额">
      <amountCountTo slot="icon" :amount="profit" :duration="duration" />
    </van-grid-item>
  </van-grid>
</template>
<script>
import Vue from 'vue'
import countTo from 'vue-count-to'
import amountCountTo from './AmountCountTo'
import { Grid, GridItem } from 'vant'
Vue.use(Grid).use(GridItem)
export default {
  name: 'OrderGrid',
  components: { countTo, amountCountTo },
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
      return this.model.paid - this.model.cost
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
<style scoped>
.van-grid-item__text {
  margin-top: 0.5rem;
  font-size: 12px;
  color: #b8b8b8;
}
.d-number {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #555;
}
.d-number span {
  text-shadow: 1px 0px 2px #999;
}
</style>
