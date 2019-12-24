import ajax from '@/utils/fetch'
import { compressImage } from '@/utils/images'
var fileHost = process.env.VUE_APP_FILE_GATEWAY_HOST

/**
 * OCR识别
 * @param {*} file
 * @param {*} type 0.身份证,1.驾驶证,2.行驶证,3.营业执照,4.车辆合格证,5.机动车发票,6.银行卡,7.护照
 */
export const ocr = (file, type) => {
  return new Promise((resolve, reject) => {
    compressImage(file)
      .then(val => {
        var param = new FormData()
        param.append('type', type)
        if (typeof val === 'string') {
          param.append('fileBase64', val)
          param.append('fileName', file.name)
        } else {
          param.append('file', val)
        }
        ajax
          .post(`${fileHost}/ocr`, param, {
            //添加请求头
            headers: { 'Content-Type': 'multipart/form-data' },
            params: {
              type: type
            }
          })
          .then(json => {
            resolve(json)
          })
          .catch(e => {
            reject(e)
          })
      })
      .catch(e => reject(e))
  })
}

/**
 * 文件上传
 * @param {*} file
 * @param {*} type 1.图片,2.视频,3.附件
 */
export const upload = (file, type = 1) => {
  var filename = file.name
  return new Promise((resolve, reject) => {
    compressImage(file)
      .then(val => {
        var param = new FormData()
        if (typeof val === 'string') {
          param.append('fileBase64', val)
          param.append('fileName', filename)
        } else {
          filename = 'file'
          param.append(filename, val)
        }
        ajax
          .post(`${fileHost}/uploader`, param, {
            //添加请求头
            headers: { 'Content-Type': 'multipart/form-data' },
            params: {
              type: type
            }
          })
          .then(json => {
            if (json && json.hasOwnProperty(filename)) {
              resolve(json[filename])
              return
            }
            reject(json)
          })
          .catch(e => reject(e))
      })
      .catch(e => reject(e))
  })
}
