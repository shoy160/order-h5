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
