import ajax from '@/utils/fetch'

var fileHost = process.env.VUE_APP_FILE_GATEWAY_HOST

/**
 * OCR识别
 * @param {*} file
 * @param {*} type
 */
export const ocr = (file, type) => {
  let param = new FormData()
  param.append('type', type)
  param.append('file', file)
  return ajax.post(`${fileHost}/ocr`, param, {
    //添加请求头
    headers: { 'Content-Type': 'multipart/form-data' },
    params: {
      type: type
    }
  })
}

/**
 * 文件上传
 * @param {*} file
 */
export const upload = file => {
  let param = new FormData()
  param.append('file', file)
  return ajax.post(`${fileHost}/upload`, param, {
    //添加请求头
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
