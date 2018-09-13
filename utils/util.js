const regeneratorRuntime = require('regenerator-runtime.js')

/**
 * 日期时间格式化
 * @param {Date} time - 时间，必传
 * @param {String} format - 格式，选传，默认'YY-MM-DD hh:mm:ss'
 */
const formatDate = (time, format = 'YY-MM-DD hh:mm:ss') => {
  let date = new Date(time)
  let year = date.getFullYear(),
    month = date.getMonth() + 1, // 月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds()
  let preArr = Array.apply(null, Array(10)).map(function(elem, index) {
    return '0' + index
  }) // 开个长度为10的数组 格式为 00 01 02 03

  let newTime = format.replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec)

  return newTime
}

/**
 * 浮点数运算
 */
const floatOpration = {
  /**
   * 加法运输，避免数据相加小数点后产生多位数和计算精度损失
   * @param {Number} num1 - 键，必传
   * @param {Number} num1 - 值，必传
   */
  add(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    let precision // 精度
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2
    return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision)
  },
  /**
   * 减法运算，避免数据相减小数点后产生多位数和计算精度损失
   * @param {Number} num1 - 键，必传
   * @param {Number} num1 - 值，必传
   */
  sub(num1, num2) {
    let baseNum, baseNum1, baseNum2
    let precision // 精度
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
  },
  /**
   * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失
   * @param {Number} num1 - 键，必传
   * @param {Number} num1 - 值，必传
   */
  multi(num1, num2) {
    let baseNum = 0
    try {
      baseNum += num1.toString().split('.')[1].length
    } catch (e) {}
    try {
      baseNum += num2.toString().split('.')[1].length
    } catch (e) {}
    return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum)
  },
  /**
   * 除法运算，避免数据相除小数点后产生多位数和计算精度损失
   * @param {Number} num1 - 键，必传
   * @param {Number} num1 - 值，必传
   */
  div(num1, num2) {
    let baseNum1 = 0
    let baseNum2 = 0
    let baseNum3, baseNum4
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }

    baseNum3 = Number(num1.toString().replace('.', ''))
    baseNum4 = Number(num2.toString().replace('.', ''))
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)
  }
}

/**
 * 判断对象是否为空对象
 * @param {Object} obj 判断对象
 */
const isEmptyObject = (obj) => {
  for (var key in obj) {
    return false
  }
  return true
}

/**
 * 异步显示Toast提示
 * @param {String} msg 提示消息内容
 */
const showToastSync = msg => {
  setTimeout(() => {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  }, 100)
}

/**
 * 公共接口请求方法
 * @param {Object} options 可参考wx.request
 */
const baseUrl = ' https://www.easy-mock.com/mock/5b99d9c7b52d21061d9ece13/minProgress' // 开发环境
const request = (options) => {
  let loginInfo = wx.getStorageSync('loginInfo');
  let auth = ''
  if (!isEmptyObject(loginInfo)) {
    auth = `Bearer ${loginInfo.token}`
  }
  let fullUrl = baseUrl + options.url

  if (!options.hideLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  wx.request({
    url: fullUrl,
    data: options.data || {},
    header: {
      'Authorization': auth
    },
    method: options.method || 'post',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      requestSuccessHandle(res, options.success)
    },
    fail: function(res) {
      showToastSync('请求失败')
      options.fail && options.fail(res)
    },
    complete: function(res) {
      wx.hideLoading()
      options.complete && options.complete(res)
    }
  })
}
/**
 * 上传文件统一处理方法
 * @param {Object} options - 键，必传
 * options.files = { key, url }
 */
const uploadFile = async(options) => {
  let auth = getAuth()
  let fullUrl = `${baseUrl}/api/Common/UploadFile`
  let uploadedNum = 0
  let uploadedFiles = []

  await new Promise((resolve, reject) => {
    options.files.map((item, index) => {
      if (!options.hideLoading) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
      }
      wx.uploadFile({
        url: fullUrl,
        filePath: item.url,
        name: item.key || 'file' + index,
        header: {
          'Authorization': auth
        },
        success: function(res) {
          requestSuccessHandle(res, (data) => {
            uploadedFiles.push(data)
          })
          if (uploadedNum === options.files.length - 1) {
            options.success && options.success(uploadedFiles)
            resolve(uploadedFiles)
          }
        },
        fail: function(res) {
          showToastSync('请求失败')
          options.fail && options.fail(res)
          reject(res)
        },
        complete: function(res) {
          uploadedNum++
          wx.hideLoading()
          options.complete && options.complete(res)
        }
      })
    })
  })
}

const getAuth = () => {
  let loginInfo = wx.getStorageSync('loginInfo')
  let auth = ''
  if (!isEmptyObject(loginInfo)) {
    auth = `Bearer ${loginInfo.token}`
  }
  return auth
}
const requestSuccessHandle = (res, callback) => {
  let statusCode = res.statusCode
  let data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
  let code = data.code
  let msg = data.message || '请求异常，请稍后再试'

  if (statusCode === 200) {
    if (code === '10000') {
      callback && callback(data.resultdata)
    } else {
      showToastSync(msg)
    }
  } else {
    switch (statusCode) {
      case 400:
        msg = '请求错误'
        break
      case 401:
        msg = '未授权，请登录'
        wx.clearStorageSync()
        wx.switchTab({
          url: 'pages/index/index'
        })
        break
      case 403:
        msg = '拒绝访问'
        break
      case 404:
        msg = '请求地址出错'
        break
      case 408:
        msg = '请求超时'
        break
      case 500:
        msg = '服务器内部错误'
        break
      case 501:
        msg = '服务未实现'
        break
      case 502:
        msg = '网关错误'
        break
      case 503:
        msg = '服务不可用'
        break
      case 504:
        msg = '网关超时'
        break
      case 505:
        msg = 'HTTP版本不受支持'
        break
      default:
        break
    }

    showToastSync(msg)
  }
}

/**
 * 小程序打开网页方法
 * @param {String} url - 打开网页地址，必传
 */
const openWebView = (url) => {
  wx.navigateTo({
    url: `/pages/web-view/web-view?pageUrl=${url}`,
  })
}

/**
 * 检查扫描二维码地址
 * @param str 扫描二维码之后获得的信息
 */
const checkGoodsUrl = (str) => {
  let reg = /^[http\/\/]/gi
  let reg1 = /\d{11,}/g

  return reg.test(str) && reg1.test(str)
}

/**
 * 转发公共处理
 */
const shareAppMessage = res => {
  let loginInfo = wx.getStorageSync('loginInfo')
  return {
    title: '田田云门店系统助手',
    path: `/pages/index/index?mobile=${loginInfo.mobile}`
  }
}

/**
 * 判断用户是否允许授权
 * @param {String} authStr scope值
 * @param {Function} callback 回调函数
 */
const checkAuth = (authStr, callback) => {
  wx.getSetting({
    success: (res) => {
      /*
       * res.authSetting = {
       *   "scope.userInfo": true,
       *   "scope.userLocation": true
       * }
       */
      let scopeStr = `scope.${authStr}`
      callback && callback(res.authSetting[scopeStr])
    },
    fail: (res) => {
      console.log('获取用户的当前设置失败！')
    }
  })
}

/**
 * 判断用户是否允许授权
 * @param {String} authStr scope值
 * @param {Function} callback 回调函数
 */
const showToast = (title) => {
  wx.showToast({
    title: title,
    icon: 'none'
  })
}

/**
 * 计算字符串的字节数
 * @param {String} str - 字符串，必传
 * @param {String} charset - 字符编码，选传
 */
const getStringByteLength = (str, charset) => {
  let total = 0,
    charCode,
    i,
    len
  charset = charset ? charset.toLowerCase() : ''
  if (charset === 'utf-16' || charset === 'utf16') {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i)
      if (charCode <= 0xffff) {
        total += 2
      } else {
        total += 4
      }
    }
  } else {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i)
      if (charCode <= 0x007f) {
        total += 1
      } else if (charCode <= 0x07ff) {
        total += 2
      } else if (charCode <= 0xffff) {
        total += 3
      } else {
        total += 4
      }
    }
  }
  return total
}

module.exports = {
  formatDate,
  floatOpration,
  request,
  uploadFile,
  openWebView,
  checkGoodsUrl,
  isEmptyObject,
  shareAppMessage,
  checkAuth,
  showToast,
  getStringByteLength
}