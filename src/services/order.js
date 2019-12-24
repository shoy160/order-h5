import ajax from '@/utils/fetch'

/**
 * 订单列表
 * @param {*} dto
 */
export const search = (dto = {}) => {
  return ajax.get('/order/simplify', {
    params: dto
  })
}

/**
 * 订单详情
 * @param {string} id
 */
export const detail = id => {
  return ajax.get(`/order/${id}`)
}

/**
 * 服务模板
 * @param {*} shopId
 */
export const templates = shopId => {
  return ajax
    .get('/template/shop', {
      params: {
        shopId: shopId,
        type: 0
      }
    })
    .then(json => {
      if (json.status && json.data) {
        var list = []
        for (var i in json.data) {
          var item = json.data[i]
          if (0 !== item.state) {
            continue
          }
          list.push({ id: item.id, text: item.name, month: item.year })
        }
        return list
      }
      return json
    })
}

/**
 * 设备模板
 * @param {*} shopId
 * @param {*} versionId
 */
export const deviceTemplate = (shopId, versionId) => {
  return ajax.get('/template/device/version_shop', {
    params: {
      shopId: shopId,
      versionId: versionId
    }
  })
}

/**
 * 保单转图片
 * @param {*} id
 */
export const policyJpg = id => {
  return ajax.get('/order/jpg', {
    params: {
      orderId: id
    }
  })
}

/**
 * 创建订单
 * @param {*} model
 */
export const create = model => {
  //时间处理
  model.serviceStart = +model.serviceStart
  model.serviceEnd = +model.serviceEnd
  model.vehicleExtend.buyTime = +model.vehicleExtend.buyTime
  //金额处理
  model.insuredAmount = model.insuredAmount * 10000
  model.vehicleExtend.ivoiceAmount = model.vehicleExtend.ivoiceAmount * 10000
  console.log(model)
  return ajax.post('/order', model)
}
