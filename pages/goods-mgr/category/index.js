/**
 * @author swan
 * @file pages/goods-mgr/category/index.js
 * @desc 商品管理分类选择页
 * @since 2018/6/14
 */
const App = getApp()
const utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    subCategories: [],
    labels: [1, 3, 45, 6, 7],
    checkedIndex: 0
  },
  handleSidebarChange: function (e) {
    let checkedIndex = e.currentTarget.dataset.index
    this.setData({
      checkedIndex: checkedIndex
    })
    this.getSubCategory(checkedIndex)
  },
  handleListChange: function (e) {
    let formData = App.globalData.goodsMgr.formData
    formData = Object.assign(formData, {
      category: e.detail.data
    })
  },
  getCategories: function () {
    let _this = this
    utils.request({
      url: '/api/Goods/GetGoodsCategoryList',
      data: {},
      success: (data) => {
        wx.setStorage({
          key: "goodMgr-category",
          data: JSON.stringify(data)
        })
        _this.setData({
          categories: data
        })
        this.getSubCategory(0)
      }
    })
  },
  getSubCategory: function (checkedIndex) {
    let {
      categories
    } = this.data
    this.setData({
      subCategories: categories[checkedIndex].goods_category_two
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategories()
  }
})