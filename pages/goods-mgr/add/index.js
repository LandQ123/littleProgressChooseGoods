/**
 * @author swan
 * @file pages/goods-mgr/add/index.js
 * @desc 商品管理新增编辑页
 * @since 2018/9/13
 */
const App = getApp()
const Dialog = require('../../../components/tty-ui/dialog/dialog');
const utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
    
      name: '',
      price: '',
      spec: '',
      unit: {
        unit_id: 0
      },
      stock: '',
      category: {
        goods_category_two_id: 0
      },
      brand: {
        brand_id: 0
      },
      num: '',
      owner: '',
      url: '',
      pics: [],
      yun_goods_id: 0,
      goods_images: []
    },
    // 错误信息提示
    errMsg: '',
    // 页面的标题
    title: '',
    // 库存增加量
    increment_stock: '',
    // 编辑状态下上传库存
    edit_stock: 0,
    // 编辑状态下原有的图片
    edit_goods_images: [],
    showModal: false
  },
  handleToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  // 扫描二维码
  handleScan: function () {
    let _this = this
    wx.scanCode({
      success: (res) => {
        // 如果二维码是http://开头且末尾长度大于32位
        if (utils.checkGoodsUrl(res.result)) {
          this.handleRequestQR(res.result)
        } else {
          this.handleForbidPic()
        }
      },
      fail: (err) => {
        if (err.errMsg.indexOf('cancel') == -1) {
          this.handleForbidPic()
        }
      }
    })
  },
  handleRequestQR: function (qrCode) {
    let _this = this
    // 根据二维码请求商品详情
    utils.request({
      url: '/api/Goods/GetGoodsByQrCode',
      data: {
        qrCode: qrCode
      },
      success: (data) => {
        let {
          type,
          goods
        } = data
        if (type == 1) {
          this.setData({
            errMsg: '很遗憾, 没有搜索到商品'
          })
          Dialog({
            selector: '#dialog-scanCode',
            buttons: [{
                text: '重新扫码',
                color: '#999',
                type: 'restart'
              },
              {
                text: '我要上报',
                color: '#1C69D3',
                type: 'upload'
              }
            ]
          }).then((res) => {
            if (res.type === 'upload') {
              // 上报商品接口
            } else {
              // 否则就是重现打开扫码窗口
              this.handleScan()
            }
          })
        } else if (type == 2) {
          this.setData({
            errMsg: '该商品已经添加'
          })
          // 提示是否重新扫描
          Dialog({
            selector: '#dialog-scanCode',
            buttons: [{
              text: '我知道了',
              color: '#999',
              type: 'known'
            }, {
              text: '重新扫描',
              color: '#1C69D3',
              type: 'restart'
            }]
          }).then((res) => {
            if (res.type === 'restart') {
              this.handleScan()
            }
          })
        } else {
          // 根据商品的数量来判断是否跳转到结果页
          if (goods.length > 1) {
            App.globalData.goodsMgr.searchResults = goods
            wx.navigateTo({
              url: '/pages/goods-mgr/result/index?title=' + _this.data.title
            })
          } else {
            // 当前结果只有一条的情况，直接回填到新增页
            _this.setData({
              formData: Object.assign({}, _this.data.formData, {
                name: goods[0].goods_name,
                spec: goods[0].goods_spec,
                unit: {
                  unit_id: goods[0].unit_id,
                  unit_name: goods[0].unit_name || ''
                },
                stock: '',
                category: {
                  goods_category_two_id: goods[0].goods_class_id,
                  goods_category_two_name: goods[0].goods_class_name || ''
                },
                brand: {
                  brand_id: goods[0].brand_id,
                  brand_name: goods[0].brand_name || ''
                },
                num: goods[0].registration_number,
                owner: goods[0].registration_holder,
                url: goods[0].qrcode,
                yun_goods_id: goods[0].yun_goods_id
              })
            })
          }
        }
      }
    })
  },
  handleForbidPic: function () {
    this.setData({
      errMsg: '该产品码不符合农药条例'
    })
    Dialog({
      selector: '#dialog-scanCode',
      buttons: [{
        text: '我知道了',
        color: '#1C69D3',
        type: 'known'
      }]
    })
  },
  handleDelPic: function (e) {
    let index = e.currentTarget.dataset.index
    let _another_index = ''
    let {
      pics,
      goods_images
    } = this.data.formData
    // 遍历查找是否删除原有图片中的图片
    goods_images.map((v, k) => {
      if (v.url === pics[index]) {
        _another_index = k
      }
    });
    (typeof _another_index === 'number') && goods_images.splice(_another_index, 1);
    pics.splice(index, 1);
    this.setData({
      formData: Object.assign({}, this.data.formData, {
        pics: pics,
        goods_images: goods_images
      })
    })
  },
  handleChoosePic: function () {
    let _this = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let pics = _this.data.formData.pics
        // 添加当前添加到已有数组
        pics = pics.concat(res.tempFilePaths)
        // 限制当前图片数量不能超过9张
        pics.length > 9 && (pics.length = 9);
        _this.setData({
          'formData': Object.assign({}, _this.data.formData, {
            pics: pics
          })
        })
        App.globalData.goodsMgr.formData.pics = pics
      }
    })
  },
  handleInput: function (e) {
    let key = e.currentTarget.dataset.name
    let value = e.detail.detail.value
    this.setData({
      formData: Object.assign({}, this.data.formData, {
        [key]: value
      })
    })
  },
  // 是否跳转到单位页
  handleUnit: function () {
    wx.navigateTo({
      url: '/pages/goods-mgr/units/index'
    })
  },
  handleStock: function () {
    this.setData({
      showModal: true
    })
  },
  handleStockInput: function (e) {
    let value = e.detail.value
    this.setData({
      increment_stock: value
    })
  },
  handleCancelStock: function () {
    this.setData({
      showModal: false
    })
  },
  handleConfirmStock: function () {
    let _this = this
    let {
      formData,
      increment_stock,
      edit_stock
    } = _this.data;
    let stock = formData.stock;
    let _increment_stock = Number(increment_stock)
    if (_increment_stock === 0) {
      this.handleToast('增加库存不能零!')
      return
    }
    if (!_increment_stock) {
      this.handleToast('库存只能输入数字!')
      return
    }
    if (_increment_stock < 0) {
      this.handleToast('库存不能小于0!')
      return
    }
    stock += _increment_stock
    if (stock > 1000000) {
      this.handleToast('总库存不应大于100万!')
      return
    } else {
      edit_stock += _increment_stock
      wx.showToast({
        title: '增加库存成功!'
      })
      _this.setData({
        formData: Object.assign({}, formData, {
          stock: stock
        }),
        increment_stock: '',
        showModal: false,
        edit_stock: edit_stock
      })
    }
  },
  handleSave: function () {
    let _this = this
    let {
      formData
    } = this.data
    // 处理商品名称
    let _name = formData.name.trim()
    if (!_name) {
      this.handleToast('请输入名称')
      return
    }
    if (_name > 25) {
      this.handleToast('名称长度不能超过25')
    }

    // 处理商品单价
    if (!formData.price) {
      this.handleToast('请输入单价')
      return
    } else {
      let isNumber = !!+(formData.price)
      if (isNumber) {
        let _price = parseFloat(formData.price)
        if (_price < 0) {
          this.handleToast('单价不能为负数')
          return
        }
        if (_price > 100000000) {
          this.handleToast('单价不应超过 1 亿元')
          return
        }
      } else {
        this.handleToast('单价只能输入数字')
        return
      }
    }

    // 判断单位名称是否为空
    if (!formData.unit.unit_name) {
      this.handleToast('请输入单位')
      return
    }

    // 检验库存
    if (formData.stock != 0) {
      let _stock = Number(formData.stock)
      if (!_stock) {
        this.handleToast('库存只能输入数字')
        return
      }
      if (_stock < 0) {
        this.handleToast('库存不能小于0')
        return false
      }
      if (_stock > 1000000) {
        this.handleToast('总库存不应大于100万')
        return false
      }
    }

    // 判断输入商品分类是否为空
    if (!formData.category.goods_category_two_name) {
      this.handleToast('请输入商品分类')
      return
    }

    // 判断商品品牌是否为空
    if (!formData.brand.brand_name) {
      this.handleToast('请输入商品品牌')
      return
    }

    // 新建一个数组保存准备上传的图片文件
    let files = []
    // 遍历当前展示的图片
    formData.pics.map((item, index) => {
      // 遍历已有图片，检查是否已经上传
      let _bool = formData.goods_images.every((img, key) => {
        return img.url != item
      });
      // 没有则需要进行上传
      _bool && files.push({
        url: item,
        key: 'good-pic-' + index
      })
    })

    // 当前准备用来上传的数组不为空
    files.length > 0 ? utils.uploadFile({
      files: files,
      success: function (data) {
        _this.handleFormSubmit(data)
      }
    }) : this.handleFormSubmit([])
  },
  handleFormSubmit: function (images) {
    let _this = this
    let {
      formData,
      title,
      edit_stock
    } = this.data
    // 保存已有图片，便于上传失败时恢复原有数据
    let _goods_images = formData.goods_images
    images.length > 0 && images.map((v) => {
      _goods_images.push(v)
    })
    utils.request({
      url: '/api/Goods/SaveGoods',
      data: {
        goods_id: title === '新增商品' ? 0 : formData.id,
        goods_name: formData.name,
        price: formData.price,
        goods_spec: formData.spec,
        unit_id: formData.unit.unit_id,
        stock: title === '新增商品' ? formData.stock : edit_stock,
        goods_class_id: formData.category.goods_category_two_id,
        goods_brand_id: formData.brand.brand_id,
        registration_number: formData.num,
        registration_holder: formData.owner,
        yun_goods_id: formData.yun_goods_id,
        qrcode: formData.url,
        goods_images: _goods_images
      },
      success: (data) => {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            App.globalData.addSucceed = 1
            wx.navigateBack({})
          }
        })
      },
      complete: (res) => {
        if (res.code != '10000') {
          formData.goods_images = new Array(..._this.data.edit_goods_images)
        }
      }
    })
  },
  onShow: function () {
    let formData = App.globalData.goodsMgr.formData
    this.setData({
      formData: Object.assign({}, this.data.formData, formData),
      edit_goods_images: formData.goods_images ? new Array(...formData.goods_images) : []
    })
  },
  onLoad: function (options) {
    // 从开单跳转过来，如果存在二维码则发起请求
    if (options.qr === '1') {
      let qr = App.globalData.qrCodeUrl
      this.handleRequestQR(qr)
    }

    wx.setNavigationBarTitle({
      title: options.title || '新增商品'
    })
    this.setData({
      title: options.title || '新增商品'
    })
  },
  onHide: function () {
    App.globalData.goodsMgr.formData = this.data.formData
  }
})
