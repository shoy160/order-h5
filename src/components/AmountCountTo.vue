<template>
  <span>
    <countTo :startVal="0" :endVal="value" :duration="duration" :decimals="2" />
    <span class="d-unit">{{ unit }}</span>
  </span>
</template>
<style scoped>
.d-unit {
  font-size: 70%;
  color: #999;
  margin-left: 0.2rem;
  text-shadow: none !important;
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
      default: 2000,
    },
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
    },
  },
}
</script>
