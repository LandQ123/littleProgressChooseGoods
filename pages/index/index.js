//index.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    userProtocolUrl: '/pages/web-view/web-view?pageUrl=https://fx.ttyun.com/docs/fx/license-description',
    carouselList: [{
        imgUrl: '../../assets/images/swiper.jpg',
        pageUrl: 'https://o.fx.ttyun.com/shop/'
      }
      // {
      //   imgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      //   pageUrl: 'https://mp.weixin.qq.com/'
      // },
      // {
      //   imgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      //   pageUrl: 'https://mp.weixin.qq.com/'
      // }
    ],
    pageList: [{
        icon: 'zhuye-kaidan',
        background: 'linear-gradient(90deg,rgba(255,184,0,1),rgba(255,130,0,1))',
        name: '开单销售',
        url: '/pages/kaidan/choose-goods/choose-goods'
      },
      {
        icon: 'control-community',
        background: 'linear-gradient(90deg,rgba(255,134,55,1),rgba(255,45,45,1))',
        name: '新增商品',
        url: '/pages/goods-mgr/add/index?title=新增商品'
      },
      {
        icon: 'zhuye-shangping',
        background: 'linear-gradient(90deg,rgba(60,162,235,1),rgba(28,105,211,1))',
        name: '商品管理',
        url: '/pages/goods-mgr/index/index'
      },
      {
        icon: 'zhuye-ruku',
        background: 'linear-gradient(90deg,rgba(255,134,55,1),rgba(255,45,45,1))',
        name: '入库',
        url: '/pages/goods-mgr/index/index'
      },
      {
        icon: 'zhuye-bangzhu',
        background: 'linear-gradient(90deg,rgba(255,185,30,1),rgba(255,130,0,0.98))',
        name: '帮助手册',
        url: 'https://fx.ttyun.com/docs/fx/a001'
      },
      {
        icon: 'zhuye-kefu',
        background: 'linear-gradient(90deg,rgba(59,176,252,1),rgba(1,123,255,1))',
        name: '在线客服',
        url: ''
      }
    ],
    showLoginModal: false,
    vcodeText: '获取验证码',
    restTime: 0,
    formData: {
      mobile: '',
      captcha: '',
      latitude: '',
      longitude: '',
      referrer: ''
    },
    showPerfectInfoModal: false,
    userInfo: {}
  },
  onLoad(e) {
    let locationInfo = app.globalData.locationInfo
    if (locationInfo) {
      this.setData({
        'formData.latitude': locationInfo.latitude,
        'formData.longitude': locationInfo.longitude
      })
    } else {
      // 由于 getLocation 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.locationReadyCallback = res => {
        this.setData({
          'formData.latitude': res.latitude,
          'formData.longitude': res.longitude
        })
      }
    }

    if (e.mobile) {
      this.setData({ 
        'formData.referrer': e.mobile
      })
      app.globalData.referrer = e.mobile
    }

    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onShow() {
    let loginInfo = wx.getStorageSync('loginInfo')
    if (!loginInfo) {
      // 显示登录模态框
      this.setData({
        showLoginModal: true
      })
      wx.hideTabBar()
    } else if (loginInfo.createType === 1) {
      // 显示完善信息模态框
      this.setData({
        showPerfectInfoModal: true
      })
      wx.hideTabBar()
    } else {
      // 隐藏完善信息模态框
      this.setData({
        showPerfectInfoModal: false
      })
      wx.showTabBar()
    }
  },
  onShareAppMessage(res) {
    return util.shareAppMessage(res)
  },
  getVcode() {
    if (this.checkMobile(this.data.formData.mobile)) {
      if (!this.data.restTime) {
        let initRestTime = 60
        this.setData({
          restTime: initRestTime,
          vcodeText: `获取中${initRestTime}s`
        })
        let int = setInterval(() => {
          let currentTime = this.data.restTime - 1
          this.setData({
            restTime: currentTime,
            vcodeText: `获取中${currentTime}s`
          })
          if (!currentTime) {
            clearInterval(int)
            this.setData({
              restTime: 0,
              vcodeText: '获取验证码'
            })
          }
        }, 1000)

        util.request({
          url: '/api/Common/SendCaptcha',
          data: {
            mobile: this.data.formData.mobile
          },
          success: (data) => {

          }
        })
      }
    }
  },
  loginSubmit(e) {
    if (this.checkMobile(e.detail.value.mobile)) {
      util.request({
        url: '/api/User/Login',
        data: this.data.formData,
        success: (data) => {
          // data.createType = 1
          wx.setStorageSync('loginInfo', data)
          this.setData({
            showLoginModal: false
          })
          if (data.createType === 0) {
            wx.showTabBar()
          } else {
            this.setData({
              showPerfectInfoModal: true
            })
          }
        }
      })
    }
  },
  checkMobile(mobile) {
    const mobileRegex = /^(0|86|17951)?((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/
    if (!mobileRegex.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return false
    }
    return true;
  },
  mobileUpdate(e) {
    this.setData({
      'formData.mobile': e.detail.value.trim()
    })
  },
  vcodeUpdate(e) {
    this.setData({
      'formData.captcha': e.detail.value.trim()
    })
  },
  goPerfectInfo() {
    wx.navigateTo({
      url: '/pages/user-center/my-store/index/index?type=add'
    })
  },
  goWebView(event) {
    let url = event.currentTarget.dataset.url;
    util.openWebView(url)
  },
  goPage(event) {
    let url = event.currentTarget.dataset.url;
    if (url.indexOf('http') === -1) {
      wx.navigateTo({
        url: url
      })
    } else {
      util.openWebView(url)
    }
  }
})