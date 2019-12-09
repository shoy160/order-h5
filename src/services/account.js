import ajax from '@/utils/fetch'

var authHost = process.env.VUE_APP_AUTH_GATEWAY_HOST

/**
 * 登录
 * @param {*} account
 * @param {*} pwd
 * @param {*} vkey
 * @param {*} vcode
 */
export const login = (account, pwd, vkey, vcode) => {
  return ajax.post(`${authHost}/account/login/return`, {
    account: account,
    password: pwd,
    vkey: vkey,
    vcode: vcode
  })
}

/**
 * 获取用户信息
 */
export const getInfo = () => {
  return ajax.get(`${authHost}/account/current`)
}

/**
 * 获取验证码
 * @param {string} key
 */
export const getVcode = key => {
  return ajax.get(`${authHost}/account/vcode/image`, {
    params: {
      key: key
    }
  })
}
