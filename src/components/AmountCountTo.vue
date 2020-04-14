<template>
  <div class="d-number">
    <countTo :startVal="0" :endVal="value" :duration="duration" :decimals="2" />
    <span class="d-unit">{{ unit }}</span>
  </div>
</template>
<style scoped>
.d-number {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #555;
}
.d-number span {
  text-shadow: 1px 0px 2px #999;
}
.d-unit {
  font-size: 70%;
  color: #999;
  margin-left: 0.2rem;
}
</style>
<script>
import countTo from 'vue-count-to'
export default {
  name: 'amountCountTo',
  components: { countTo },
  props: {
    amount: Number,
    duration: {
      type: Number,
      default: 2000
    }
  },
  computed: {
    unit() {
      return this.amount < 1000
        ? '元'
        : this.amount < 10000 * 10000
        ? '万元'
        : '亿元'
    },
    value() {
      return this.amount < 1000
        ? this.amount
        : this.amount < 10000 * 10000
        ? this.amount / 10000.0
        : this.amount / 100000000.0
    }
  }
}
</script>
