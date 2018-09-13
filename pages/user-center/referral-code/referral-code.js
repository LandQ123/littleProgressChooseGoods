//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
const palette = require('./share-image.js')

Page({
  data: {
    paletteData: {},
    shareImageUrl: ''
  },
  onReady() {
    const qrcodeShareImage = app.globalData.qrcodeShareImage
    const referQrcode = wx.getStorageSync('referQrcode')
    if (qrcodeShareImage) {
      this.setData({
        shareImageUrl: qrcodeShareImage
      })
    } else {
      if (referQrcode) {
        this.drawShareImage()
      } else {
        // util.getQrcodeAndSave(this.drawShareImage)
        this.getReferQrcode()
      }
    }
  },
  getReferQrcode() {
    let loginInfo = wx.getStorageSync('loginInfo')
    util.request({
      url: '/api/WeChat/GetShareCode',
      data: {
        mobile: loginInfo.mobile
      },
      success: (data) => {
        wx.setStorageSync('referQrcode', data.shareCode)
        this.drawShareImage()
      }
    })
  },
  saveQrcode() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImageUrl,
      success: (res) => {
        wx.showToast({
          title: '保存图片成功',
          icon: 'none'
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '保存图片失败',
          icon: 'none'
        })
      }
    })
  },
  onImgOK(e) {
    this.setData({
      shareImageUrl: e.detail.path
    })
  },
  onImgErr(e) {
    debugger
  },
  drawShareImage() {
    this.setData({
      paletteData: palette()
    })
  },
  tapHandle() {
    wx.previewImage({
      current: this.data.shareImageUrl, // 当前显示图片的http链接
      urls: [this.data.shareImageUrl] // 需要预览的图片http链接列表
    })
  },
  longPressHandle() {
    this.saveQrcode()
  }
})