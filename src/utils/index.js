import { UA } from 'singerjs'
import axios from 'axios'
/**
 * 时间转换
 */
export const toDate = (time) => {
  if (!time) return new Date()
  try {
    if (typeof time === 'number') return new Date(time)
    if (typeof time === 'string') new Date(time.replace(/-/g, '/'))
    return new Date(time)
  } catch (e) {
    return time
  }
}

/**
 * 添加天数
 * @param {*} time
 * @param {*} day
 */
export const dateAdd = (time, day) => {
  var date = toDate(time)
  if (date && day) date.setDate(date.getDate() + day)
  return date
}

/**
 * 保留小数位
 * @param {*} x
 * @param {*} decimals
 */
export const toDecimal = (x, decimals = 2) => {
  var num = parseFloat(x)
  if (isNaN(num)) {
    return false
  }
  var pow = Math.pow(10, decimals)
  num = Math.round(x * pow) / pow
  var s = num.toString()
  var rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + decimals) {
    s += '0'
  }
  return s
}

/**
 * 计算比例
 * @param {*} total
 * @param {*} num
 * @param {*} decimals
 */
export const calcRatio = (total, num, decimals = 2) => {
  if (total === 0 || num === 0) return toDecimal(0, decimals)
  return toDecimal(num / total, decimals)
}

/**
 * 是否是手机号码
 */
export const isMobile = (mobile) => {
  return /^1[0-9]{10}$/gi.test(mobile)
}

/**
 * 是否是微信
 */
export function isWeixin() {
  var ua = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(ua)
}

/**
 * 是否是支付宝
 */
export function isAlipay() {
  var ua = navigator.userAgent.toLowerCase()
  return /alipay/i.test(ua)
}

/**
 * 使用地图
 */
export const useMap = () => {
  return new Promise(function(resolve) {
    if (typeof AMap !== 'undefined') {
      resolve()
      return
    }
    var script = document.createElement('script')
    script.src =
      'http://webapi.amap.com/maps?v=1.4.4&key=f9832fe43fee3422044090cd1ed8392b&plugin=AMap.Geocoder'
    script.type = 'text/javascript'
    script.async = true
    if (script.readyState) {
      //IE
      script.onreadystatechange = function() {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null
          resolve()
        }
      }
    } else {
      //Others: Firefox, Safari, Chrome, and Opera
      script.onload = function() {
        resolve()
      }
    }
    document.body.appendChild(script)
  })
}

const download = (url, filename) => {
  // console.log(url, filename)
  // 创建隐藏<a>标签进行下载
  var tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = url
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
}

export const downloadFile = (url, filename) => {
  var ua = UA()
  return new Promise((resolve, reject) => {
    if (ua.ios) {
      download(url, filename)
      resolve()
    } else {
      axios({
        method: 'get',
        responseType: 'arraybuffer',
        url: url,
      })
        .then((res) => {
          let blob = new Blob([res.data], {
            //type类型后端返回来的数据中会有，根据自己实际进行修改
            type: 'application/pdf',
          })
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // console.log('save blob')
            window.navigator.msSaveBlob(blob, filename)
          } else {
            var blobURL = window.URL.createObjectURL(blob)
            // console.log(blobURL, filename)
            download(blobURL, filename)
            window.URL.revokeObjectURL(blobURL)
          }
          resolve()
        })
        .catch((err) => {
          //调试阶段可以看看报的什么错
          // console.log('error', err)
          reject(err)
        })
    }
  })
}

export const idTypes = [
  { type: 1, text: '身份证' },
  { type: 2, text: '驾驶证' },
  { type: 3, text: '军官证' },
  { type: 4, text: '护照' },
  { type: 6, text: '港澳通行证' },
]

export const contactTypes = ['家人', '同事', '朋友', '其他']

export const paymodes = [
  { type: 1, text: '支付宝' },
  { type: 2, text: '微信' },
  { type: 3, text: '对公转账' },
  { type: 4, text: '成都银行扫码' },
  { type: 5, text: 'POS机' },
  { type: 6, text: '月结' },
]
export const installContacts = [
  { type: 0, text: '驻店员' },
  { type: 1, text: '销售顾问' },
  { type: 2, text: '车主' },
  { type: 3, text: '备用联系人' },
  { type: -1, text: '其他' },
]

export const orderStates = [
  { type: 0, text: '待支付' },
  { type: 10, text: '待初审' },
  { type: 11, text: '初审驳回' },
  { type: 20, text: '待复审' },
  { type: 21, text: '复审驳回' },
  { type: 30, text: '待终审' },
  { type: 31, text: '终审驳回' },
  { type: 40, text: '已完成' },
  { type: -200, text: '已作废' },
  { type: -201, text: '作废审核' },
  { type: -202, text: '作废驳回' },
  { type: -300, text: '已退保' },
  { type: -301, text: '退保中' },
  { type: -302, text: '退保失败' },
  { type: -400, text: '停止服务' },
]
