/**
 * @author swan
 * @file pages/goods-mgr/result/index.js
 * @desc 查询结果
 * @since 2018/6/14
 */
const App = getApp()
Page({
  data: {
    results: [],
    title: ''
  },
  handleTap: function (e) {
    let {
      results,
      title
    } = this.data
    let index = e.currentTarget.dataset.index
    let formData = App.globalData.goodsMgr.formData
    formData = Object.assign(formData, {
      name: results[index].goods_name,
      spec: results[index].goods_spec,
      unit: {
        unit_id: results[index].unit_id,
        unit_name: results[index].unit_name || ''
      },
      stock: '',
      category: {
        goods_category_two_id: results[index].goods_class_id,
        goods_category_two_name: results[index].goods_class_name || ''
      },
      brand: {
        brand_id: results[index].brand_id,
        brand_name: results[index].brand_name || ''
      },
      num: results[index].registration_number,
      owner: results[index].registration_holder,
      url: results[index].qrcode,
      yun_goods_id: results[index].yun_goods_id
    })
    wx.navigateBack({
      url: '/page/goodsMgr/add/index?title=' + title
    })
  },
  onLoad: function (options) {
    this.setData({
      results: App.globalData.goodsMgr.searchResults,
      title: options.title
    })
  }
})