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
  return ajax.get('/template/shop', {
    params: {
      shopId: shopId,
      type: 0
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
