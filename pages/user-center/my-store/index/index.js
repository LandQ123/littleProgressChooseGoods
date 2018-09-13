//获取应用实例
const app = getApp()
const util = require('../../../../utils/util.js')
const regeneratorRuntime = require('../../../../utils/regenerator-runtime.js')

Page({
  data: {
    formData: {
      shopLinkMan: '',
      shopTelphone: '',
      shopName: '',
      shopAddress: '',
      latitude: '',
      longitude: '',
      referrer: '',
      referrerName: '',
      shopDoorPhoto: [],
      businessLicensePhoto: []
    },
    showAuthDialog: false,
    isReferrerInputDisabled: true
  },
  onLoad(e) {
    util.checkAuth('userLocation', (hasAuth) => {
      if (!hasAuth) {
        this.setData({
          showAuthDialog: true
        })
      }
    })

    this.getStoreInfo()
  },
  onShow: function() {
    let formData = app.globalData.storeInfo.formData
    this.setData({
      formData: Object.assign({}, this.data.formData, formData)
    })
  },
  onHide: function() {
    app.globalData.storeInfo.formData = this.data.formData
  },
  getStoreInfo() {
    util.request({
      url: '/api/Shop/GetShopInfo',
      data: {},
      success: (data) => {
        this.setData({
          formData: data
        })
        if (!data.referrer) {
          this.setData({
            isReferrerInputDisabled: false
          })
        }
      }
    })
  },
  saveStoreInfo() {
    util.request({
      url: '/api/Shop/EditShop',
      data: this.data.formData,
      success: (data) => {
        util.showToast('保存成功')
        let loginInfo = wx.getStorageSync('loginInfo')
        loginInfo.createType = 0
        wx.setStorageSync('loginInfo', loginInfo)
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })
  },
  handleInput(e) {
    let key = e.currentTarget.dataset.name
    let value = e.detail.detail.value
    this.setData({
      formData: Object.assign({}, this.data.formData, {
        [key]: value
      })
    })
  },
  chooseImage(e) {
    let _this = this
    let arrayName = e.currentTarget.dataset.arrayname
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        // 添加当前添加到已有数组
        let images = _this.data.formData[arrayName]
        res.tempFilePaths.map((item, index) => {
          images.push({
            url: item,
            key: `${arrayName}-${index}`
          })
        })
        // images = images.concat(res.tempFilePaths)
        // 限制当前图片数量不能超过9张
        if (images.length > 9) {
          images.length = 9
          util.showToast('最多上传9张')
        }
        _this.setData({
          formData: Object.assign({}, _this.data.formData, {
            [arrayName]: images
          })
        })
        app.globalData.storeInfo.formData[arrayName] = images
      }
    })
  },
  deleteImage(e) {
    let arrayName = e.currentTarget.dataset.arrayname
    let index = e.currentTarget.dataset.index
    let images = this.data.formData[arrayName]

    images.splice(index, 1)

    this.setData({
      formData: Object.assign({}, this.data.formData, {
        [arrayName]: images
      })
    })
  },
  async uploadImage(arrayNames, callback) {
    let _this = this
    let completeNum = 0
    await arrayNames.map(async(arrayName) => {
      let files = []
      let imagesTemp = []
      this.data.formData[arrayName].map((item, index) => {
        if (item.url.indexOf('//tmp') !== -1) {
          item.key = `${arrayName}-${index}`
          files.push(item)
        } else {
          imagesTemp.push(item)
        }
      })

      // 当前准备用来上传的数组不为空
      if (files.length) {
        await util.uploadFile({
          files: files,
          success: function(data) {
            let images = imagesTemp.concat(data)
            _this.setData({
              formData: Object.assign({}, _this.data.formData, {
                [arrayName]: images
              })
            })
            completeNum++
          }
        })
      } else {
        completeNum++
      }

      if (completeNum === arrayNames.length) {
        callback && callback()
      }
    })
  },
  formSubmit(e) {
    let telephoneReg = /(^0\d{2,3}-?\d{7,8}(-?[0-9]{1,4})?$)|(^(0|86|17951)?((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$)/
    let numberReg = /^\d+$/
    if (!this.data.formData.shopLinkMan) {
      util.showToast('请输入店长姓名')
      return
    } else if (util.getStringByteLength(this.data.formData.shopLinkMan) > 20) {
      util.showToast('店长姓名输入过长')
      return
    }
    if (!this.data.formData.shopTelphone) {
      util.showToast('请输入店长电话')
      return
    } else if (!telephoneReg.test(this.data.formData.shopTelphone)) {
      util.showToast('店长电话输入格式不正确')
      return
    }
    if (!this.data.formData.shopName) {
      util.showToast('请输入门店名称')
      return
    } else if (util.getStringByteLength(this.data.formData.shopName) > 60) {
      util.showToast('门店名称输入过长')
      return
    }
    if (!this.data.formData.shopAddress) {
      util.showToast('请输入门店地址')
      return
    }
    if (!this.data.formData.referrer) {
      util.showToast('请输入门推荐人')
      return
    } else if (!numberReg.test(this.data.formData.referrer)) {
      util.showToast('推荐人格式不正确，请输入数字')
      return
    }
    if (!this.data.formData.shopDoorPhoto || !this.data.formData.shopDoorPhoto.length) {
      util.showToast('请上传门店门头照片')
      return
    }

    const arrayNames = ['shopDoorPhoto', 'businessLicensePhoto']
    this.uploadImage(arrayNames, this.saveStoreInfo)
  },
  confirmTap() {
    this.setData({
      showAuthDialog: false
    })
  },
  cancelTap() {
    this.setData({
      showAuthDialog: false
    })
  },
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          formData: Object.assign({}, app.globalData.storeInfo.formData, {
            shopAddress: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          })
        })
        app.globalData.storeInfo.formData = this.data.formData
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})