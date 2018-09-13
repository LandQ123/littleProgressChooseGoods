/**
 * @author swan
 * @file pages/goods-mgr/index.js
 * @desc 商品管理入口
 * @since 2018/6/14
 */
const App = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeData: [],
    tip: ''
  },
  handleViewDetail: function (e) {
    let _this = this
    util.request({
      url: '/api/Goods/GetGoodsDetail',
      data: {
        goods_id: e.detail.id
      },
      success: (data) => {
        let formData = App.globalData.goodsMgr.formData
        let pics = []
        data.goods_images.map((img, key) => {
          pics.push(img.url)
        })
        formData = Object.assign(formData, {
          name: data.goods_name,
          price: data.price,
          spec: data.goods_spec,
          unit: {
            unit_id: data.unit_id,
            unit_name: data.unit_name || ''
          },
          stock: data.stock,
          category: {
            goods_category_two_id: data.goods_class_id,
            goods_category_two_name: data.goods_class_name || ''
          },
          brand: {
            brand_id: data.brand_id || data.goods_brand_id,
            brand_name: data.brand_name || data.goods_brand_name || ''
          },
          num: data.registration_number,
          owner: data.registration_holder,
          url: data.qrcode,
          yun_goods_id: data.yun_goods_id,
          pics: pics,
          goods_images: data.goods_images,
          id: data.goods_id
        })
        wx.navigateTo({
          url: '/pages/goods-mgr/add/index?title=编辑商品'
        })
      }
    })
  },
  getGoodsPageList: function () {
    let _this = this
    util.request({
      url: '/api/Goods/GetGoodsPageList',
      data: {
        requestType: 0
      },
      success: (data) => {
        _this.setData({
          typeData: data,
          tip: data.length ? '' : '您还没有商品哦~'
        })
      }
    })
  },
  onShow: function () {
    // 当前页面清空添加或修改数据
    App.globalData.goodsMgr.formData = {}
    this.getGoodsPageList()
  },
  onShareAppMessage(res) {
    return util.shareAppMessage(res)
  }
})
