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

/**
 * 经销商列表
 */
export const shopList = (page = 1) => {
  return ajax.get(`${authHost}/shop/current`, {
    params: {
      page: page,
      size: 500
    }
  })
}

/**
 * 机构列表
 * @param {*} type 1,保险公司
 * @param {*} page 2,金融公司
 */
export const unitList = (type, page = 1) => {
  return ajax.get(`${authHost}/unit`, {
    params: {
      type: type,
      state: 0,
      page: page,
      size: 50
    }
  })
}

/**
 * 车型树形结构
 * @param {*} type
 */
export const versionTree = (type = 4) => {
  return ajax.get(`${authHost}/vehicle/basic/list/tree`, {
    params: {
      bitwise: type,
      isCurrent: true
    }
  })
}

/**
 * 驻店员列表
 * @param {*} shopId
 */
export const icbSaleList = shopId => {
  return ajax(`${authHost}/appm/employee/acb_sale`, {
    params: {
      shopId: shopId
    }
  })
}

/**
 * 店铺销售
 * @param {*} shopId
 * @param {*} page
 */
export const saleList = (shopId, page = 1) => {
  return ajax.get(`${authHost}/shop/employee`, {
    params: {
      role: 4,
      shopId: shopId,
      page: page,
      size: 50
    }
  })
}
