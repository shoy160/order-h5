<template>
  <div>
    <div class="d-avatar">
      <van-image
        round
        width="8rem"
        height="8rem"
        src="http://220.167.101.49:8092/uploads/-/system/group/avatar/30/20170227.png"
      />
      <h3>用户登录</h3>
    </div>
    <van-cell-group>
      <van-field
        v-model="account"
        required
        clearable
        label="用户名"
        placeholder="请输入用户名"
        @click-right-icon="$toast('question')"
      />

      <van-field
        v-model="pwd"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
      />
      <van-field
        v-model="vcode"
        label="验证码"
        placeholder="请输入验证码"
        required
      >
        <van-image slot="right-icon" :src="vimage" @click="refreshVcode" />
      </van-field>
    </van-cell-group>
    <div class="d-btn">
      <van-button type="primary" @click="handleLogin">登 录</van-button>
    </div>
  </div>
</template>
<style scoped>
.d-avatar {
  text-align: center;
  margin: 2.5rem 0;
}
.d-avatar h3 {
  color: #999;
}
.d-btn {
  margin-top: 1.5rem;
  text-align: center;
}
.d-btn .van-button {
  width: 80%;
}
</style>
<script>
import Vue from 'vue'
import { Field, CellGroup, Button, Image } from 'vant'
import { getVcode, login } from '@/services/account'
import { setTicket } from '@/utils/auth'
Vue.use(CellGroup)
  .use(Field)
  .use(Button)
  .use(Image)

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      account: '',
      pwd: '',
      vkey: '',
      vcode: '',
      vimage: ''
    }
  },
  mounted() {
    this.refreshVcode()
  },
  methods: {
    refreshVcode() {
      getVcode(this.vkey).then(json => {
        this.vkey = json.codeKey
        this.vimage = json.data
      })
    },
    handleLogin() {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true
      })
      login(this.account, this.pwd, this.vkey, this.vcode)
        .then(json => {
          setTicket(json.ticket)
          this.$router.replace('/order')
        })
        .catch(() => {
          // loading.clear()
        })
    }
  }
}
</script>
