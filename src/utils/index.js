/**
 * 时间转换
 */
export const toDate = time => {
  if (!time) return new Date()
  try {
    if (typeof time === 'number') return new Date(time)
    if (typeof time === 'string') new Date(time.replace(/-/g, '/'))
    return new Date(time)
  } catch (e) {}
  return time
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
 * 是否是手机号码
 */
export const isMobile = mobile => {
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
  return new Promise(function(resolve, reject) {
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
