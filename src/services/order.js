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
  return ajax
    .get('/template/device/version_shop/list', {
      params: {
        shopId: shopId,
        versionId: versionId
      }
    })
    .then(json => {
      if (json.status && json.data) {
        var list = []
        for (var i in json.data) {
          var item = json.data[i]
          list.push({ id: item.id, text: item.deviceName })
        }
        return list
      }
      return json
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
  model.vehicleExtend.mortgageAmount =
    model.vehicleExtend.mortgageAmount * 10000
  // console.log(model)
  return ajax.post('/order', model)
}

/**
 * 订单详情
 * @param {string} id
 */
export const detail = id => {
  return ajax.get(`/order/${id}`).then(json => {
    // console.log(json)
    //时间处理
    json.serviceStart = new Date(json.serviceStart)
    json.serviceEnd = new Date(json.serviceEnd)
    json.vehicleExtend.buyTime = new Date(json.vehicleExtend.buyTime)
    //金额处理
    json.receivableAmount = json.receivableAmount.toString()
    json.paidAmount = json.paidAmount.toString()
    json.handlePaidAmount = json.handlePaidAmount.toString()
    json.insuredAmount = (parseFloat(json.insuredAmount) / 10000.0).toString()
    json.vehicleExtend.ivoiceAmount = (
      parseFloat(json.vehicleExtend.ivoiceAmount) / 10000.0
    ).toString()
    if (json.vehicleExtend.mortgageAmount) {
      json.vehicleExtend.mortgageAmount = (
        parseFloat(json.vehicleExtend.mortgageAmount) / 10000.0
      ).toString()
    }
    if (json.vehicleExtend.mortgageMonth) {
      json.vehicleExtend.mortgageMonth = json.vehicleExtend.mortgageMonth.toString()
    }

    json.remark = json.remark || ''
    json.orderSource = json.orderSource || 4
    json.vehicleExtend.plateColor = json.vehicleExtend.plateColor || '蓝色'

    return json
  })
}

/**
 * 编辑订单
 * @param {*} model
 */
export const edit = model => {
  //时间处理
  model.serviceStart = +model.serviceStart
  model.serviceEnd = +model.serviceEnd
  model.vehicleExtend.buyTime = +model.vehicleExtend.buyTime
  //金额处理
  model.insuredAmount = model.insuredAmount * 10000
  model.vehicleExtend.ivoiceAmount = model.vehicleExtend.ivoiceAmount * 10000
  model.vehicleExtend.mortgageAmount =
    model.vehicleExtend.mortgageAmount * 10000

  return ajax.put('/order/edit', model)
}

/**
 * 草稿列表
 * @param {*} page
 * @param {*} size
 */
export const draftList = (page = 1, size = 10) => {
  return ajax.get('/draft/list', {
    params: {
      page: page,
      size: size,
      draftType: 1
    }
  })
}
