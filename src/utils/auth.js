import Cookies from 'js-cookie'
const _ticketName = '__icb_order_ticket'

/**
 * 获取ticket
 */
export function getTicket() {
  return Cookies.get(_ticketName)
}

/**
 * 设置ticket
 * @param {string} ticket 登录令牌
 */
export function setTicket(ticket) {
  Cookies.set(_ticketName, ticket)
}

/**
 * 清空ticket
 */
export function removeTicket() {
  Cookies.remove(_ticketName)
}

export default {
  getTicket,
  setTicket,
  removeTicket
}
