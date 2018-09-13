// pages/kaidan/confirm-order/confirm-order.js
/**
 * 开单确认**/
let app = getApp();
const utils = require('../../../utils/util');
const Dialog = require('../../../components/tty-ui/dialog/dialog');
const multi = utils.floatOpration.multi;
const add = utils.floatOpration.add;
Page({
  data: {
    goodsData: [],
    showBasket: false,
    name: '',
    num: '',
    totalMoney: 0
  },
  onShow() {
    if (app.globalData.orderSucceed === 1) {
      this.setData({
        totalMoney: 0,
        goodsData: [],
        name: '',
        num: '',
      });
    }
  },
  onLoad(options) {
    let goodsData = app.globalData.buyerInfo.orderGoods;
    let totalMoney = 0;
    if (!goodsData) {
      return
    }
    for (let i = 0; i < goodsData.length; i++) {
      let item = goodsData[i];
      item.amount = multi(item.price, item.count);
      totalMoney = add(totalMoney, multi(item.price, item.count))
    }
    this.setData({
      goodsData: goodsData,
      totalMoney: totalMoney
    });
  },
  handleNameInput(e) {
    this.setData({
      name: e.detail.detail.value
    });
  },
  handleNumInput(e) {
    this.setData({
      num: e.detail.detail.value
    });
  },
  collectMoney() {
    let name = this.data.name;
    let num = this.data.num;
    let money = this.data.totalMoney;
    let nameReg = /^[\u4e00-\u9fa5]{2,10}$/;
    let phoneNumReg = /(^0\d{2,3}-?\d{7,8}(-?[0-9]{1,4})?$)|(^(0|86|17951)?((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$)/;
    if (!this.data.goodsData.length) {
      Dialog({
        message: '请先添加商品！',
        confirmButtonText: '好的',
        selector: '#tty-mention-confirm'
      }).then(() => {
        wx.redirectTo({
          url: '../choose-goods/choose-goods'
        })
      });
      return
    }
    if (!name) {
      wx.showToast({
        title: '客户姓名不能为空！',
        icon: 'none',
        duration: 1500
      });
      return
    }
    if (num && !phoneNumReg.test(num.replace(/\s+/g, ''))) {
      wx.showToast({
        title: '请输入正确格式的号码！',
        icon: 'none',
        duration: 1500
      });
      return
    }
    if (!nameReg.test(name.replace(/\s+/g, ''))) {
      wx.showToast({
        title: '请填写2位以上的中文姓名！',
        icon: 'none',
        duration: 1500
      });
      return
    }
    app.globalData.buyerInfo.name = name;
    app.globalData.buyerInfo.num = num;
    wx.navigateTo({
      url: '../collect-money/collect-money?money=' + money
    })
  }
});