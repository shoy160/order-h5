import Exif from 'exif-js'

/**
 * 图片矫正
 * @param img
 * @param dir
 * @param callback
 */
var correctImage = function(img, dir) {
  return new Promise((resolve, reject) => {
    try {
      var image = new Image()
      image.onload = function() {
        var degree = 0,
          drawWidth,
          drawHeight,
          width,
          height
        drawWidth = this.naturalWidth
        drawHeight = this.naturalHeight
        //以下改变一下图片大小
        var maxSide = Math.max(drawWidth, drawHeight)
        if (maxSide > 1024) {
          var minSide = Math.min(drawWidth, drawHeight)
          minSide = (minSide / maxSide) * 1024
          maxSide = 1024
          if (drawWidth > drawHeight) {
            drawWidth = maxSide
            drawHeight = minSide
          } else {
            drawWidth = minSide
            drawHeight = maxSide
          }
        }
        // console.log(drawHeight, drawWidth)
        var canvas = document.createElement('canvas')
        canvas.width = width = drawWidth
        canvas.height = height = drawHeight
        var context = canvas.getContext('2d')
        if (dir) {
          //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
          switch (dir) {
            //iphone横屏拍摄，此时home键在左侧
            case 3:
              degree = 180
              drawWidth = -width
              drawHeight = -height
              break
            //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
            case 6:
              canvas.width = height
              canvas.height = width
              degree = 90
              drawWidth = width
              drawHeight = -height
              break
            //iphone竖屏拍摄，此时home键在上方
            case 8:
              canvas.width = height
              canvas.height = width
              degree = 270
              drawWidth = -width
              drawHeight = height
              break
          }
          if (degree != 0) {
            //使用canvas旋转校正
            context.rotate((degree * Math.PI) / 180)
          }
        }
        context.drawImage(this, 0, 0, drawWidth, drawHeight)
        //返回校正图片
        resolve(canvas.toDataURL('image/jpeg', 0.88))
      }
      image.src = img
    } catch (e) {
      reject(e)
    }
  })
}

var defaultOption = {
  size: 200 * 1024
}

export const compressImage = (file, option) => {
  option = Object.assign(defaultOption, option)
  return new Promise((resolve, reject) => {
    // 看支持不支持FileReader
    if (!file) {
      reject({ eror: '图片文件异常' })
      return
    }
    if (!window.FileReader || file.size <= option.size) {
      resolve(file)
    }
    var orientation
    //去获取拍照时的信息，解决拍出来的照片旋转问题
    Exif.getData(file, function() {
      orientation = Exif.getTag(this, 'Orientation')
    })
    // 创建一个reader
    var reader = new FileReader()
    // 读取成功后的回调
    reader.onload = e => {
      var imgData = e.target.result
      correctImage(imgData, orientation).then(data => {
        resolve(data)
      })
    }
    // 将图片2将转成 base64 格式
    reader.readAsDataURL(file)
  })
}
