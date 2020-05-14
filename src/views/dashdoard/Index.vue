<template>
  <div>
    <van-nav-bar
      title="实时数据"
      left-text="返回"
      right-text="刷新"
      left-arrow
      @click-left="handleBack"
      @click-right="handleRefresh"
    />
    <van-tabs v-model="type" @change="handleTabChange">
      <van-tab title="今日" :name="0">
        <order-grid :model="counts[0]" />
      </van-tab>
      <!-- <van-tab title="昨日" :name="1">
        <order-grid :model="counts[1]" />
      </van-tab> -->
      <van-tab title="本月" :name="10">
        <order-grid :model="counts[10]" />
      </van-tab>
      <!-- <van-tab title="上月" :name="11">
        <order-grid :model="counts[11]" />
      </van-tab> -->
      <van-tab title="本年" :name="100">
        <order-grid :model="counts[100]" />
      </van-tab>
      <!-- <van-tab title="去年" :name="101">
        <order-grid :model="counts[101]" />
      </van-tab> -->
    </van-tabs>
    <van-panel title="服务年限">
      <canvas id="chartYears" style="width:100%"></canvas>
    </van-panel>
    <van-panel title="订单数据">
      <canvas id="chartBasic" style="width:100%"></canvas>
    </van-panel>
  </div>
</template>

<script>
import Vue from 'vue'
import OrderGrid from '@/components/OrderGrid'
import { calcRatio } from '@/utils'
import { NavBar, Panel, Tabs, Tab } from 'vant'
Vue.use(NavBar)
  .use(Panel)
  .use(Tabs)
  .use(Tab)
import F2 from '@antv/f2'
import _ from 'lodash'

import { orderMonths, orderCounts } from '@/services/statistic'

export default {
  name: 'Dashdoard',
  components: { OrderGrid },
  data() {
    return {
      type: 0,
      chartYears: undefined,
      counts: {},
    }
  },
  mounted() {
    this.getData()
    this.getMonths()
  },
  methods: {
    handleBack() {
      this.$router.replace('/mine')
    },
    handleRefresh() {
      this.type = 0
      this.counts = {}
      this.getData()
      this.getMonths()
    },
    handleTabChange() {
      if (this.counts.hasOwnProperty(this.type)) {
        this.yearsChart(this.counts[this.type])
        return
      }
      this.getData()
    },
    getData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      orderCounts(this.type)
        .then((res) => {
          this.$set(this.counts, this.type, res)
          this.yearsChart(res)
          this.$toast.clear()
        })
        .catch(() => {
          this.$toast.clear()
        })
      // orderCounts(this.type + 1).then((res) => {
      //   this.$set(this.counts, this.type + 1, res)
      // })
    },
    getMonths() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      orderMonths()
        .then((res) => {
          let data = []
          res.data.map((item) => {
            data.push({
              name: '总单量',
              month: item.month,
              orders: item.count,
            })
            data.push({
              name: '按揭单量',
              month: item.month,
              orders: item.mortgageCount,
            })
          })
          this.basicChart(data)
          this.$toast.clear()
        })
        .catch(() => {
          this.$toast.clear()
        })
    },
    basicChart(data) {
      const chart = new F2.Chart({
        id: 'chartBasic',
        pixelRatio: window.devicePixelRatio,
      })
      chart.source(data, {
        orders: {
          tickCount: 5,
        },
      })
      chart.tooltip({
        custom: true, // 自定义 tooltip 内容框
        onChange: function onChange(obj) {
          const legend = chart.get('legendController').legends.top[0]
          const tooltipItems = obj.items
          const legendItems = legend.items
          const map = {}
          legendItems.forEach(function(item) {
            map[item.name] = _.clone(item)
          })
          tooltipItems.forEach(function(item) {
            const name = item.name
            const value = item.value
            if (map[name]) {
              map[name].value = value
            }
          })
          legend.setItems(_.values(map))
        },
        onHide: function onHide() {
          const legend = chart.get('legendController').legends.top[0]
          legend.setItems(chart.getLegendItems().country)
        },
      })
      chart
        .interval()
        .position('month*orders')
        .color('name')
        .adjust({
          type: 'dodge',
          marginRatio: 0.05, // 设置分组间柱子的间距
        })
      chart.render()
    },
    initChartYears() {
      const chart = new F2.Chart({
        id: 'chartYears',
        pixelRatio: window.devicePixelRatio,
      })

      chart.tooltip(false)

      chart.coord('polar', {
        transposed: true,
        radius: 0.85,
      })
      chart.axis(false)
      this.chartYears = chart
    },
    yearsChart(counts) {
      let total = parseFloat(
        counts.oneYear +
          counts.twoYear +
          counts.threeYear +
          counts.fourYear +
          counts.otherYear
      )
      var data = [
        {
          name: '一年期',
          count: counts.oneYear,
          a: '1',
        },
        {
          name: '二年期',
          count: counts.twoYear,
          a: '1',
        },
        {
          name: '三年期',
          count: counts.threeYear,
          a: '1',
        },
        {
          name: '四年期',
          count: counts.fourYear,
          a: '1',
        },
        {
          name: '其他',
          count: counts.otherYear,
          a: '1',
        },
      ]
      const map = {}
      data.map((item) => {
        map[item.name] = `${calcRatio(total, item.count * 100, 1)}%`
      })
      if (this.chartYears) {
        this.chartYears.legend({
          position: 'right',
          itemFormatter: function itemFormatter(val) {
            return val + '  ' + map[val]
          },
        })
        this.chartYears.changeData(data)
      } else {
        this.initChartYears()
        this.chartYears.legend({
          position: 'right',
          itemFormatter: function itemFormatter(val) {
            return val + '  ' + map[val]
          },
        })
        this.chartYears.source(data, {
          percent: {
            formatter: function formatter(val) {
              return val + '%'
            },
          },
        })
        this.chartYears
          .interval()
          .position('a*count')
          .color('name', [
            '#1890FF',
            '#13C2C2',
            '#2FC25B',
            '#FACC14',
            '#F04864',
            '#8543E0',
          ])
          .adjust('stack')
          .style({
            lineWidth: 1,
            stroke: '#fff',
            lineJoin: 'round',
            lineCap: 'round',
          })
          .animate({
            appear: {
              duration: 1200,
              easing: 'bounceOut',
            },
          })
        this.chartYears.render()
      }
    },
  },
}
</script>
