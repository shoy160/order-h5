import {
  toDate
} from './index'

const _formatDate = function (date, format) {
  date = toDate(date)
  if (!(date instanceof Date)) {
    return date
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return format
}

/**
 * 格式化时间
 * @param {Date} date
 * @param {string} format
 */
export function time(date, format = 'yyyy-MM-dd hh:mm') {
  return _formatDate(date, format)
}

/**
 * 获取属性或下标值
 * @param {*} value
 * @param {*} obj
 * @param {*} step
 */
export function attr(value, obj, step = -1) {
  if (obj instanceof Array) {
    return obj[parseInt(value) + step]
  }
  return obj.hasOwnProperty(value) ? obj[value] : value
}
