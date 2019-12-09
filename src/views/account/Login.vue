<template>
  <div>
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
    <van-button type="primary" @click="handleLogin" class="btn-login"
      >登 录</van-button
    >
  </div>
</template>
<style scoped>
.btn-login {
  margin-top: 1.5rem;
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
      login(this.account, this.pwd, this.vkey, this.vcode).then(json => {
        setTicket(json.ticket)
        this.$router.replace('/order')
      })
    }
  }
}
</script>
