//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')

Page({
  data: {
    userInfo: {
      avatarUrl: '/assets/images/user-avatar-default.png',
      nickName: '昵称呢？'
    },
    loginInfo: {},
    pageList: [
      [{
          iconType: 'wode-mendian',
          iconColor: '#00a0e6',
          name: '我的门店',
          url: '/pages/user-center/my-store/index/index'
        },
        {
          iconType: 'wode-banlixukez',
          iconColor: '#00a0e6',
          name: '办理《农药经营许可证》',
          url: 'https://o.fx.ttyun.com/shop/'
        }
      ],
      [{
        iconType: 'wode-qrcode',
        iconColor: '#ff3200',
        name: '推荐码',
        url: '/pages/user-center/referral-code/referral-code'
      }],
      [{
          iconType: 'wode-xiazai',
          iconColor: '#00a0e6',
          name: '下载PC版门店系统',
          url: 'https://fx.ttyun.com/docs/fx/31'
        },
        {
          iconType: 'wode-bangzhu',
          iconColor: '#ff8200',
          name: '帮助手册',
          url: 'https://fx.ttyun.com/docs/fx/a001'
        },
        {
          iconType: 'wode-kefu',
          iconColor: '#00a0e6',
          name: '在线客服',
          url: ''
        }
      ]
    ],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    let loginInfo = wx.getStorageSync('loginInfo')
    this.setData({
      loginInfo: loginInfo
    })

    if (app.globalData.userInfo && app.globalData.userInfo.avatarUrl.indexOf('http') !== -1) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShareAppMessage(res) {
    return util.shareAppMessage(res)
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goPage(event) {
    let url = event.currentTarget.dataset.url;
    if (url.indexOf('https') === -1) {
      wx.navigateTo({
        url: url
      })
    } else {
      util.openWebView(url)
    }
  }
})