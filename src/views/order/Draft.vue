<template>
  <div>
    <van-nav-bar
      title="草稿箱"
      :fixed="true"
      left-text="返回"
      left-arrow
      class="d-header"
      :z-index="100"
      @click-left="handleBack"
    >
    </van-nav-bar>
    <van-pull-refresh v-model="refresh" @refresh="handleRefresh">
      <van-list v-model="loading" :finished="finished" @load="handleLoad">
        <van-panel
          v-for="item in list"
          :key="item.id"
          :title="item.createTime | formatDate('yyyy-MM-dd hh:mm')"
        >
          <div class="d-content">
            <order-tags :model="item" />
            <div class="d-item">
              <label>{{ item.ownerType == 1 ? '车主' : '企业' }}:</label>
              <span>{{ item.ownerName }}</span>
            </div>
            <div class="d-item">
              <label>手机号码:</label>
              <span>{{ item.ownerMobile }}</span>
            </div>
            <div class="d-item">
              <label>驻店员:</label>
              <span>{{ item.acbSaleName }}</span>
            </div>
            <div class="d-item">
              <label>销售员:</label>
              <span>
                {{ item.shopSaleName || '无' }}
                <small>{{ item.shopName }}</small>
              </span>
            </div>
          </div>
          <div slot="footer" class="d-footer">
            <van-button size="small" @click="handleEdit(item.id)">
              编辑
            </van-button>
          </div>
        </van-panel>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, PullRefresh, List, Panel, Button } from 'vant'
import OrderTags from '@/components/OrderTags'
import { draftList } from '@/services/order'
Vue.use(NavBar)
  .use(PullRefresh)
  .use(List)
  .use(Panel)
  .use(Button)
export default {
  name: 'OrderDraft',
  components: { OrderTags },
  data() {
    return {
      loading: false,
      refresh: false,
      finished: false,
      total: 0,
      page: 0,
      size: 15,
      list: [],
    }
  },
  methods: {
    getList() {
      return draftList(this.page, this.size).then((json) => {
        if (this.page === 1) this.list = []
        this.total = json.total
        this.list = this.list.concat(json.data)
        this.loading = this.refresh = false
        this.finished = this.total <= this.page * this.size
      })
    },
    handleRefresh() {
      this.page = 1
      this.getList()
    },
    handleLoad() {
      if (this.page > 1) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
        })
      }
      this.page++
      this.getList().then(() => {
        this.$toast.clear()
      })
    },
    handleBack() {
      this.$router.go(-1)
    },
    handleEdit(id) {
      this.$router.push({ name: 'OrderDraftEdit', params: { draftId: id } })
    },
  },
}
</script>
<style>
.van-pull-refresh {
  margin-top: 45px;
}
.van-panel {
  margin-bottom: 1rem;
}
.van-list {
  background-color: #f9f9f9;
}
.van-panel__footer {
  background-color: #fefefe;
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
</style>
