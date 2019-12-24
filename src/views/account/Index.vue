<template>
  <div>
    <div class="d-avatar">
      <van-image round width="10rem" height="10rem" :src="userAvatar" />
      <h3>{{ userNick }}</h3>
    </div>
    <van-cell-group>
      <van-cell title="设置" is-link />
    </van-cell-group>
    <div style="text-align:center">
      <van-button type="danger" class="logout" @click="handleLogout"
        >安全退出</van-button
      >
    </div>
    <menus active="mine" />
  </div>
</template>
<script>
import Menus from '@/components/Menus'
import { removeTicket } from '@/utils/auth'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { CellGroup, Cell, Button, Image } from 'vant'
Vue.use(CellGroup)
  .use(Cell)
  .use(Button)
  .use(Image)
export default {
  name: 'Mine',
  components: {
    Menus
  },
  computed: {
    ...mapGetters(['userAvatar', 'userNick'])
  },
  methods: {
    handleLogout() {
      removeTicket()
      this.$router.go(0)
    }
  }
}
</script>
<style>
.d-avatar {
  text-align: center;
  margin: 2.5rem 0;
}
.logout {
  width: 80%;
  margin: 1.5rem auto;
}
</style>
