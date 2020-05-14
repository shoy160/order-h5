<template>
  <div class="d-selector">
    <div class="d-selector-top">
      <van-nav-bar
        title="选择车型"
        left-text="返回"
        left-arrow
        @click-left="handleBack"
      />
      <van-search
        v-model="keyword"
        clearable
        placeholder="请输入关键字"
        show-action
        @search="handleSearch"
      >
        <div slot="action" @click="handleSearch">搜索</div>
      </van-search>
    </div>
    <van-index-bar :index-list="indexList" :sticky-offset-top="100">
      <template v-for="item in list">
        <van-index-anchor
          v-if="item.isIndex"
          :index="item.index"
          :key="item.index"
        />
        <van-cell v-else :key="item.id" @click="handleSelect(item)">
          <div slot="title" class="d-breadcrumb">
            <span>{{ item.factory }}</span>
            <van-icon name="arrow" />
            <span>{{ item.brand }}</span>
            <van-icon name="arrow" />
            <span>{{ item.name }}</span>
          </div>
        </van-cell>
      </template>

      <!-- <template v-for="item in carTypes">
        <template v-for="c2 in item.children">
          <van-cell v-for="child in c2.children" :key="child.id">
            <div slot="title" class="d-breadcrumb">
              <span>{{ item.name }}</span>
              <van-icon name="arrow" />
              <span>{{ c2.name }}</span>
              <van-icon name="arrow" />
              <span>{{ child.name }}</span>
            </div>
          </van-cell>
        </template>
      </template> -->
    </van-index-bar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { NavBar, IndexBar, IndexAnchor, Cell, Search, Icon } from 'vant'
Vue.use(NavBar)
  .use(IndexBar)
  .use(IndexAnchor)
  .use(Cell)
  .use(Search)
  .use(Icon)

export default {
  name: 'VersionSelector',
  props: {
    type: {
      type: Number,
      default: 4,
    },
    brand: String,
  },
  computed: {
    ...mapGetters(['carTypes', 'motoTypes']),
  },
  watch: {
    type(val) {
      this.getVersions(val)
    },
    brand(val) {
      this.keyword = val
    },
  },
  data() {
    return { keyword: '', indexList: [], list: [] }
  },
  mounted() {
    var array = this.brand.split('/')
    this.keyword = array.length > 1 ? array[1] : array[0]
    this.getVersions(this.type)
  },
  methods: {
    handleSelect(version) {
      var item = Object.assign({}, version)
      item.desc = item.desc.replace(/,/g, ' / ')
      this.$emit('select', item)
    },
    handleBack() {
      this.$emit('cancel')
    },
    getVersions(type) {
      this.$toast.loading({
        message: '加载中...',
      })
      this.$store.dispatch('getTypes', {
        type: type,
        callback: () => {
          this.handleSearch()
          this.$toast.clear()
        },
      })
    },
    handleSearch() {
      this.list = []
      this.indexList = []
      var index = ''
      var types = this.type == 4 ? this.carTypes : this.motoTypes
      this.$toast.loading({
        message: '搜索中...',
      })
      for (var i in types) {
        var item = types[i]
        if (
          this.keyword &&
          item.desc.indexOf(this.keyword.toUpperCase()) < 0 &&
          item.pinyin.indexOf(this.keyword.toUpperCase()) < 0
        ) {
          continue
        }
        if (item.index != index) {
          index = item.index
          this.indexList.push(index)
          this.list.push({ isIndex: true, index: item.index })
        }
        this.list.push(item)
      }
      this.$toast.clear()
    },
  },
}
</script>
<style>
.d-selector {
  padding-top: 100px;
}
.d-selector-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}
.van-index-bar {
  background-color: #f7f8fa;
  /* margin-top: 100px; */
}
.van-index-bar__index {
  padding: 0.15rem 0.7rem;
}
.van-index-bar__sidebar {
  top: 58%;
}
.d-breadcrumb {
  color: #666;
}
.d-breadcrumb span {
  vertical-align: middle;
}
.d-breadcrumb .van-icon {
  color: #c0c4cc;
  line-height: 1;
  font-weight: 400;
  margin: 0 6px;
  vertical-align: middle;
}
</style>
