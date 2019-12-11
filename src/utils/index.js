import { UA } from 'singerjs'
import axios from 'axios'
/**
 * 时间转换
 */
export const toDate = time => {
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
  // 创建隐藏<a>标签进行下载
  var tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = url
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  console.log(tempLink)
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
        url: url
      })
        .then(res => {
          let blob = new Blob([res.data], {
            //type类型后端返回来的数据中会有，根据自己实际进行修改
            type: 'application/pdf'
          })
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, filename)
          } else {
            var blobURL = window.URL.createObjectURL(blob)
            download(blobURL, filename)
            window.URL.revokeObjectURL(blobURL)
          }
          resolve()
        })
        .catch(err => {
          //调试阶段可以看看报的什么错
          console.log('error', err)
          reject(err)
        })
    }
  })
}
