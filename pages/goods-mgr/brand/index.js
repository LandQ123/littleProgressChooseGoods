/**
 * @author swan
 * @file pages/goods-mgr/brand/index.js
 * @desc 商品管理选择标页
 * @since 2018/6/14
 */
const App = getApp()
const Dialog = require('../../../components/tty-ui/dialog/dialog');
const utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brands: [],
    newBrand: '',
    showModal: false
  },
  handleAdd: function () {
    this.setData({
      showModal: true
    })
  },
  handleInput: function (e) {
    this.setData({
      newBrand: e.detail.value
    })
  },
  handleChange: function (e) {
    let formData = App.globalData.goodsMgr.formData
    formData = Object.assign(formData, {
      brand: e.detail.data
    })
  },
  getBrands: function () {
    let _this = this
    utils.request({
      url: '/api/Goods/GetGoodsBrand',
      data: {},
      success: (data) => {
        _this.setData({
          brands: data
        })
      }
    })
  },
  handleConfirmBtn: function () {
    this.setData({
      showModal: false,
      newBrand: ''
    })
  },
  handleCancelBtn: function () {
    let _this = this
    if (this.data.newBrand) {
      if (this.data.newBrand.length > 10) {
        wx.showToast({
          title: '品牌名称最大为10个字',
          icon: 'none'
        })
        return
      }
      utils.request({
        url: '/api/Goods/SaveGoodsBrand',
        data: {
          brand_id: 0,
          brand_name: this.data.newBrand
        },
        success: (data) => {
          _this.getBrands()
          wx.showToast({
            title: '保存成功'
          })
          _this.setData({
            showModal: false,
            newBrand: ''
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入品牌',
        icon: 'none'
      })
    }
  },
  onLoad: function (options) {
    this.getBrands()
  }
})
