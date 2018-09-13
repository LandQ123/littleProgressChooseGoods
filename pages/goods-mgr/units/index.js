/**
 * @author swan
 * @file pages/goods-mgr/add-units/index.js
 * @desc 选择单位
 * @since 2018/6/14
 */
const App = getApp()
const utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    units: [],
    checkedIndex: ''
  },

  handleChange: function (e) {
    let formData = App.globalData.goodsMgr.formData
    formData = Object.assign(formData, {
      unit: e.detail.data
    })
  },
  getUnits: function () {
    let _this = this
    utils.request({
      url: '/api/Goods/GetGoodsUnitList',
      data: {},
      success: (data) => {
        _this.setData({
          units: data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUnits()
  }
})