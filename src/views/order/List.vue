<template>
  <div>
    <!-- <van-nav-bar title="订单列表" :fixed="true" :z-index="10">
      <van-icon name="search" slot="right" />
    </van-nav-bar> -->
    <van-search
      v-model="keyword"
      clearable
      placeholder="请输入+状态/保函号/车架号/车主"
      show-action
      class="d-search"
      @search="handleSearch"
    >
      <div slot="action" @click="handleSearch">搜索</div>
    </van-search>
    <menus active="orders" />
    <van-pull-refresh v-model="refresh" @refresh="handleRefresh">
      <van-list v-model="loading" :finished="finished" @load="handleLoad">
        <van-panel
          v-for="item in list"
          :key="item.id"
          :title="item.policyNumber"
          :status="item.stateFormat"
          :class="'d-status-' + item.state"
        >
          <div class="d-content">
            <order-tags :model="item" />
            <div class="d-item">
              <label>车架号:</label>
              <span>{{ item.vin }}</span>
            </div>
            <div class="d-item">
              <label>{{ item.ownerType == 1 ? '车主' : '企业' }}:</label>
              <span>{{ item.ownerName }}</span>
            </div>
            <div class="d-item">
              <label>驻店员:</label>
              <span>{{ item.acbSaleName }}</span>
            </div>
            <div class="d-item">
              <label>销售员:</label>
              <span>
                {{ item.shopSaleName }} <small>{{ item.shopName }}</small>
              </span>
            </div>
            <div class="d-item">
              <label>服务期限:</label>
              <span>
                {{ item.serviceStart | formatDate('yyyy年MM月dd日') }}
                <small>至</small>
                {{ item.serviceEnd | formatDate('yyyy年MM月dd日') }}
              </span>
            </div>
            <div class="d-item">
              <label>创建时间:</label>
              <span>{{
                item.createTime | formatDate('yyyy-MM-dd hh:mm')
              }}</span>
            </div>
            <div class="d-item" v-if="item.reason">
              <label>{{ item.stateFormat }}原因:</label>
              <span>{{ item.reason }}</span>
            </div>
          </div>
          <div slot="footer" class="d-footer">
            <van-button size="small" @click="handleDetail(item.id)">
              详情
            </van-button>
            <van-button
              v-if="[11, 21, 31].includes(item.state)"
              size="small"
              type="info"
              @click="handleEdit(item.id)"
            >
              编辑
            </van-button>
            <van-button
              v-if="item.isElectronPolicy && item.state == 40"
              size="small"
              type="warning"
              @click="handlePolicy(item.id, item.policyNumber)"
            >
              保单
            </van-button>
          </div>
        </van-panel>
      </van-list>
    </van-pull-refresh>
    <!-- <van-popup v-model="isShowPdf" closeable :style="{ width: '90%' }">
      <pdf-view ref="pdfView" :src="pdfUrkl" />
    </van-popup> -->
    <pdf-view
      ref="pdfView"
      :src="pdfUrl"
      :jpg="jpgUrl"
      :show="isShowPdf"
      :name="pdfName"
      @closed="handlePdfClose"
    />
  </div>
</template>
<script>
import Menus from '@/components/Menus'
import PdfView from '@/components/PdfView'
import OrderTags from '@/components/OrderTags'
import Vue from 'vue'
import {
  PullRefresh,
  NavBar,
  Search,
  List,
  Panel,
  Tag,
  Button,
  Icon,
  Row,
  Col,
  Popup
} from 'vant'

Vue.use(NavBar)
  .use(Search)
  .use(List)
  .use(Panel)
  .use(Tag)
  .use(Button)
  .use(Icon)
  .use(PullRefresh)
  .use(Row)
  .use(Col)
  .use(Popup)
import { search, detail, policyJpg } from '@/services/order'
import { logs } from '@/services/account'
export default {
  name: 'orderList',
  components: {
    Menus,
    PdfView,
    OrderTags
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
        size: 15
      },
      keyword: '',
      active: 'orders',
      loading: false,
      refresh: false,
      finished: false,
      stateList: {
        40: '已完成'
      },
      list: [],
      total: 0,
      isShowPdf: false,
      pdfUrl: '',
      jpgUrl: '',
      pdfName: ''
    }
  },
  mounted() {
    this.keyword = this.$store.getters.keyword
  },
  methods: {
    getList(clear = false) {
      this.$store.dispatch('updateKeyword', this.keyword)
      this.input.state = -1
      this.input.vin = ''
      this.input.policyNumber = ''
      this.input.owner = ''
      if (this.keyword) {
        if (/^\+\d{1,2}$/gi.test(this.keyword)) {
          //状态码
          this.input.state = parseInt(this.keyword)
        } else if (/^1\d{10}$/gi.test(this.keyword)) {
          //手机号
          this.input.owner = this.keyword
        } else if (/^\d{4,}$/gi.test(this.keyword)) {
          //保函号
          this.input.policyNumber = this.keyword
        } else if (/^[0-9a-z]+$/gi.test(this.keyword)) {
          //车架号
          this.input.vin = this.keyword
        } else {
          if (this.keyword.indexOf('完成') >= 0) {
            this.input.state = 40
          } else if (this.keyword.indexOf('审核') >= 0) {
            this.input.state = 11
          } else {
            this.input.owner = this.keyword
          }
        }
      }
      return search(this.input).then(json => {
        if (clear) this.list = []
        for (var i in json.data) {
          var item = json.data[i]
          if ([11, 21, 31].includes(item.state)) {
            this.loadReason(item.id)
          }
        }
        this.list = this.list.concat(json.data)
        this.total = json.total
        this.loading = this.refresh = false
        if (this.total <= this.input.page * this.input.size)
          this.finished = true
      })
    },
    loadReason(id) {
      logs(id, 1, 1).then(json => {
        var reason = '无'
        if (json.data && json.data.length) {
          reason = json.data[0].remark
        }
        var index = this.list.findIndex(e => e.id === id)
        if (index >= 0) {
          var item = this.list[index]
          item.reason = reason
          this.$set(this.list, index, item)
        }
      })
    },
    handleSearch() {
      this.$toast.loading({
        message: '搜索中...',
        forbidClick: true
      })
      this.input.page = 1
      window.scrollTo({ top: 0 })
      this.getList(true).then(() => {
        this.$toast.clear()
      })
    },
    handleRefresh() {
      this.input.page = 1
      this.getList(true)
    },
    handleLoad() {
      if (this.input.page > 1) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true
        })
      }
      this.getList().then(() => {
        this.input.page += 1
        this.$toast.clear()
      })
    },
    handleDetail(id) {
      this.$router.push({ name: 'OrderDetail', params: { id } })
      // this.$toast({
      //   message: '敬请期待',
      //   position: 'bottom'
      // })
      // console.log(id)
    },
    handleEdit(id) {
      this.$router.push({ name: 'OrderEdit', params: { id } })
    },
    handlePolicy(id, policy) {
      detail(id).then(json => {
        if (json.policyFile) {
          this.isShowPdf = true
          this.pdfName = `icb_${policy}.pdf`
          this.pdfUrl = json.policyFile
        }
      })
      policyJpg(id).then(json => {
        this.jpgUrl = json
      })
    },
    handlePdfClose() {
      this.isShowPdf = false
      // this.pdfUrl = ''
    }
  }
}
</script>
<style>
* {
  -webkit-user-select: auto;
}
.van-list {
  margin: 54px 0;
}
.van-panel {
  margin-bottom: 0.5rem;
}

.van-panel__footer {
  background-color: #f9f9f9;
}
.d-search {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
}
.d-content {
  padding: 20px;
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
.d-item small {
  color: #999;
}
.d-footer {
  text-align: right;
}
.d-footer .van-button {
  margin-left: 0.3rem;
}

.d-status--200 .van-panel__header-value {
  color: #999;
}
.d-status-10 .van-panel__header-value {
  color: #1989fa;
}

.d-status-20 .van-panel__header-value {
  color: #ff976a;
}

.d-status-40 .van-panel__header-value {
  color: #07c160;
}
</style>
