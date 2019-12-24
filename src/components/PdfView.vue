<template>
  <div class="d-view" v-show="show">
    <van-popup
      v-model="showPopup"
      closeable
      :page="1"
      :style="{ width: '95%' }"
      @closed="handleClosed"
    >
      <van-loading v-if="loading" vertical
        >加载较慢，请耐心等待或下载查看</van-loading
      >
      <pdf :src="src" ref="wrapper" class="d-pdf" @loaded="handleLoaded"></pdf>
    </van-popup>
    <div class="d-actions">
      <!-- <van-button size="small" icon="close" @click="handleClosed">
        关闭
      </van-button> -->
      <!-- <van-button icon="down" type="primary" size="small" @click="downloadPDF">
        下载
      </van-button> -->
      <a
        :href="src"
        class="van-button van-button--warning van-button--small"
        :download="name"
        target="_blank"
        id="download_link"
      >
        下载保单
      </a>
    </div>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import Vue from 'vue'
import { Loading, Button } from 'vant'
import { downloadFile } from '@/utils'
Vue.use(Loading).use(Button)

export default {
  name: 'PdfView',
  components: { pdf },
  props: {
    src: String,
    name: String,
    show: Boolean
  },
  data() {
    return {
      loading: true,
      showPopup: false
    }
  },
  watch: {
    show(val) {
      this.showPopup = val
    }
    // src() {
    //   this.src && this.downloadPDF()
    // }
  },
  methods: {
    handleLoaded() {
      // console.log('loaded')
      this.$emit('loaded')
      this.loading = false
    },
    handleProgress(num) {
      this.$emit('progress',num)
    },
    handleClosed() {
      this.showPopup = false
      this.$emit('closed')
    },
    //下载PDF
    downloadPDF() {
      this.$toast.loading({
        message: '下载中...',
        forbidClick: true
      })
      downloadFile(this.src, this.name)
        .then(() => {
          this.$toast.clear()
        })
        .catch(() => {
          this.$toast.clear()
        })
    }
  }
}
</script>
<style>
.d-view {
  overflow-y: auto;
  overflow-x: hidden;
  text-align: center;
}
.d-view .van-loading {
  margin-top: 45%;
}
.d-view .d-actions {
  position: fixed;
  bottom: 1rem;
  z-index: 9999;
  text-align: center;
  width: 100%;
  background-color: transparent;
}
.d-view .d-actions .van-button {
  margin-right: 1rem;
}
/* .d-view .d-pdf {
  width: 1200px;
} */
</style>
