<template>
  <div>
    <van-nav-bar title="订单列表" :fixed="true" :z-index="10">
      <!-- <van-icon name="plus" slot="left" /> -->
      <van-icon name="search" slot="right" />
    </van-nav-bar>
    <menus active="orders" />
    <van-pull-refresh v-model="loading" @refresh="handleRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="handleLoad"
      >
        <van-panel
          v-for="item in list"
          :key="item.id"
          :title="item.policyNumber"
          :status="item.stateFormat"
        >
          <div class="d-content">
            <div class="d-tags">
              <van-tag type="primary" plain>{{
                item.orderType == 0 ? 'i车保' : '凡车汇'
              }}</van-tag>
              <van-tag color="#ff5400" plain>{{
                item.ownerType == 1 ? '个人' : '团体'
              }}</van-tag>
              <!-- <van-tag color="#dd85ee" plain v-if="item.isMortgage">摩托</van-tag> -->
              <van-tag type="success" plain v-if="item.isElectronPolicy"
                >电子</van-tag
              >
              <van-tag color="#7232dd" plain v-if="item.isBuyTradition"
                >传统</van-tag
              >
              <van-tag type="warning" plain v-if="item.isMortgage"
                >按揭</van-tag
              >
              <van-tag type="danger" plain v-if="item.isUsedCar">二手</van-tag>
            </div>
            <div class="d-item">
              <label>车架号:</label>
              <span>{{ item.vin }}</span>
            </div>
            <div class="d-item">
              <label>服务期限:</label>
              <span>
                {{ item.serviceStart | formatDate('yyyy年MM月dd日') }} 至
                {{ item.serviceEnd | formatDate('yyyy年MM月dd日') }}
              </span>
            </div>
            <div class="d-item">
              <label>车主:</label>
              <span>{{ item.ownerName }}</span>
            </div>
            <div class="d-item">
              <label>驻店员:</label>
              <span>{{ item.acbSaleName }}</span>
            </div>
            <div class="d-item">
              <label>销售员:</label>
              <span>{{ item.shopSaleName }} {{ item.shopName }}</span>
            </div>
            <div class="d-item">
              <label>创建时间:</label>
              <span>{{
                item.createTime | formatDate('yyyy-MM-dd hh:mm')
              }}</span>
            </div>
          </div>
          <div slot="footer" class="d-footer">
            <van-button size="small">详情</van-button>
            <van-button
              v-if="item.state == 40"
              size="small"
              type="warning"
              @click="handlePolicy(item.id)"
              >保单</van-button
            >
          </div>
        </van-panel>
      </van-list>
    </van-pull-refresh>
    <pdf-view ref="pdfView" />
  </div>
</template>
<script>
import Menus from '@/components/Menus'
import PdfView from '@/components/PdfView'
import Vue from 'vue'
import { PullRefresh, NavBar, List, Panel, Tag, Button, Icon } from 'vant'

Vue.use(NavBar)
  .use(List)
  .use(Panel)
  .use(Tag)
  .use(Button)
  .use(Icon)
  .use(PullRefresh)
import { search, detail } from '@/services/order'
export default {
  name: 'orderList',
  components: {
    Menus,
    PdfView
  },
  data() {
    return {
      input: {
        vin: '',
        policyNumber: '',
        state: -1,
        begin: '',
        end: '',
        page: 1,
        size: 30
      },
      active: 'orders',
      loading: false,
      finished: false,
      list: [],
      total: 0
    }
  },
  // mounted() {
  //   this.getList()
  // },
  methods: {
    getList(clear = false) {
      return search(this.input).then(json => {
        if (clear) this.list = []
        this.list = this.list.concat(json.data)
        this.total = json.total
        this.loading = false
        if (this.total <= this.input.page * this.input.size)
          this.finished = true
      })
    },
    handleRefresh() {
      this.input.page = 1
      this.getList(true)
    },
    handleLoad() {
      this.getList().then(() => {
        this.input.page += 1
      })
    },
    handlePolicy(id) {
      detail(id).then(json => {
        if (json.policyFile) {
          this.$refs.pdfView.previewPDF(json.policyFile)
        }
      })
    }
  }
}
</script>
<style>
.van-list {
  margin-top: 46px;
}
.van-panel {
  margin-bottom: 0.5rem;
}
.van-tag {
  margin-right: 0.3rem;
}
.van-panel__footer {
  background-color: #f9f9f9;
}
.d-content {
  padding: 20px;
}
.d-tags {
  margin-bottom: 1rem;
}
.d-item {
  color: #666;
  font-size: 14px;
  line-height: 26px;
}
.d-item label {
  color: #999;
  margin-right: 0.5rem;
}
.d-footer {
  text-align: right;
}
.d-footer .van-button {
  margin-left: 0.3rem;
}
</style>
