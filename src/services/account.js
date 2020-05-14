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
    vcode: vcode,
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
export const getVcode = (key) => {
  return ajax.get(`${authHost}/account/vcode/image`, {
    params: {
      key: key,
    },
  })
}

/**
 * 经销商列表
 */
export const shopList = (page = 1, size = 50, name = '') => {
  return ajax
    .get(`${authHost}/shop/current`, {
      params: {
        name: name,
        page: page,
        size: size,
      },
    })
    .then((json) => {
      if (json.status && json.data) {
        var shops = []
        for (var i in json.data) {
          var item = json.data[i]
          shops.push({
            id: item.id,
            text: item.name,
            address: item.addrDesc,
            bitwise: item.bitwise,
          })
        }
        return shops
      }
      return json
    })
}

export const shopDetail = (id) => {
  return ajax.get(`${authHost}/shop/bitwise/${id}`)
}

/**
 * 机构列表
 * @param {*} type 1,保险公司
 * @param {*} page 2,金融公司
 */
export const unitList = (type, page = 1) => {
  return ajax
    .get(`${authHost}/unit`, {
      params: {
        type: type,
        state: 0,
        page: page,
        size: 50,
      },
    })
    .then((json) => {
      if (json.status && json.data) {
        var units = []
        for (var index in json.data) {
          var item = json.data[index]
          units.push({
            id: item.id,
            text: item.name,
            remark:
              item.financeExtend && item.financeExtend.financeRemark
                ? item.financeExtend.financeRemark
                : '',
          })
        }
        return units
      }
      return json
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
      isCurrent: true,
    },
  })
}

/**
 * 车型配置列表
 * @param {*} versionId
 * @param {*} all
 */
export const configList = (versionId) => {
  // var onsale = !all
  return ajax
    .get(`${authHost}/vehicle/basic/config`, {
      params: {
        versionId: versionId,
        page: 1,
        size: 500,
        nosale: '',
      },
    })
    .then((json) => {
      if (json.status && json.data) {
        var list = []
        for (var index in json.data) {
          var item = json.data[index]
          list.push({ id: item.id, text: item.name })
        }
        return list
      }
      return json
    })
}

/**
 * 驻店员列表
 * @param {*} shopId
 */
export const icbSaleList = (shopId) => {
  return ajax
    .get(`${authHost}/appm/employee/acb_sale`, {
      params: {
        shopId: shopId,
      },
    })
    .then((json) => {
      if (json.status && json.data) {
        var list = []
        for (var index in json.data) {
          var item = json.data[index]
          list.push({ id: item.id, text: item.name || '', mobile: item.mobile })
        }
        return list
      }
      return json
    })
}

/**
 * 店铺销售
 * @param {*} shopId
 * @param {*} page
 */
export const saleList = (shopId, page = 1) => {
  return ajax
    .get(`${authHost}/shop/employee`, {
      params: {
        role: 4,
        shopId: shopId,
        page: page,
        size: 50,
      },
    })
    .then((json) => {
      if (json.status && json.data) {
        var list = []
        for (var index in json.data) {
          var item = json.data[index]
          list.push({ id: item.id, text: item.name || '', mobile: item.mobile })
        }
        return list
      }
      return json
    })
}

/**
 * 金融备注
 * @param {*} shopId
 * @param {*} financeId
 */
export const financeRemark = (shopId, financeId) => {
  return ajax
    .get(`${authHost}/shop/${shopId}`, {
      params: {
        financeId: financeId,
      },
    })
    .then((json) => {
      return json.financeRemark1 || ''
    })
}

export const logs = (sourceId, page = 1, size = 20) => {
  return ajax.get(`${authHost}/sys/logs`, {
    params: {
      sourceId: sourceId,
      page: page,
      size: size,
    },
  })
}
