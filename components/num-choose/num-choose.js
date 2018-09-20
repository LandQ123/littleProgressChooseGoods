// components/num-choose/num-choose.js
Component({
  properties: {
    goodsId: {
      type: String,
      value: 0
    },
    totalNum: { // 选择该商品的总数
      type: Number,
      value: 0
    },
    totalStock: { // 库存
      type: Number,
      value: 0
    },
    typeOneIndex: {
      type: Number,
      value: 0,
      desc: '一级索引'
    },
    typeTwoIndex: {
      type: Number,
      value: 0,
      desc: '二级索引'
    },
    goodsIndex: {
      type: Number,
      value: 0,
      desc: '三级索引'
    }
  },
  data: {
    hasNum: false,
    totalNum: 0,
    change: false // 是否为手动输入
  },
  attached() {
    let totalNum = this.properties.totalNum;
    if (totalNum) {
      this.setData({
        hasNum: true,
        totalNum: totalNum,
        typeOneIndex: this.properties.typeOneIndex,
        typeTwoIndex: this.properties.typeTwoIndex,
        goodsIndex: this.properties.goodsIndex,
        totalStock: this.properties.totalStock
      });
    }
  },
  methods: {
    plusHandle(e) { // 增加事件
      let {totalNum, typeOneIndex, typeTwoIndex, goodsIndex, totalStock} = this.data
      let goodsId = e.currentTarget.dataset.goodsid;
      totalNum++;
      if (totalStock === 0) {
        wx.showToast({
          title: '请增加库存！',
          icon: 'none',
          duration: 1500
        })
        return
      }
      if (totalNum > totalStock) { // 超过库存
        wx.showToast({
          title: '库存不足，请增加库存！',
          icon: 'none',
          duration: 1500
        })
        return
      }
      this.setData({
        totalNum,
        change: false
      });
      let myEventDetail = {
        goodsId: goodsId,
        totalNum: totalNum,
        typeOneIndex: typeOneIndex,
        typeTwoIndex: typeTwoIndex,
        goodsIndex: goodsIndex,
        action: 'plus' // 增加事件标记
      }; // detail对象，提供给事件监听函数
      this.triggerEvent('StepperEvent', myEventDetail) // 触发父级事件
    },
    focusNum(e) {
      // 手动输入时获取基础数据
      this.triggerEvent('StepperEvent', {
        action: 'getNum',
        num: Number(e.detail.value)
      });
    },
    blurNum(e) {
      // 失去焦点，改变状态
      this.setData({
        change: false
      });
      // 购物篮失去焦点，商品数为0则清空
      let myEventDetail = {}
      let goodsId = e.currentTarget.dataset.goodsid;
      myEventDetail = {
        goodsId: goodsId,
        action: 'blur'
      };
      this.triggerEvent('StepperEvent', myEventDetail)
    },
    changeNum(e) {
      let num = Number(e.detail.value)
      let {typeOneIndex, typeTwoIndex, goodsIndex, totalStock} = this.data
      let goodsId = e.currentTarget.dataset.goodsid;
      let myEventDetail = {}
      let totalNum = 0;
      if (num > totalStock) { // 超过库存
        wx.showToast({
          title: '库存不足，请增加库存！',
          icon: 'none',
          duration: 1500
        })
        this.setData({
          totalNum: num,
          change: false
        });
        totalNum = totalStock;
      } else {
        totalNum = num;
      }
      myEventDetail = {
        goodsId: goodsId,
        totalNum: totalNum,
        typeOneIndex: typeOneIndex,
        typeTwoIndex: typeTwoIndex,
        goodsIndex: goodsIndex,
        action: 'change'
      };
      this.setData({
        totalNum: totalNum,
        change: true
      });
      this.triggerEvent('StepperEvent', myEventDetail)
    },
    minusHandle(e) {
      let num = this.data.totalNum;
      let {typeOneIndex, typeTwoIndex, goodsIndex} = this.data
      let goodsId = e.currentTarget.dataset.goodsid;
      if (num <= 0) {
        return
      }
      num--;
      let myEventDetail = {
        goodsId: goodsId,
        totalNum: num,
        typeOneIndex: typeOneIndex,
        typeTwoIndex: typeTwoIndex,
        goodsIndex: goodsIndex,
        action: 'minus'
      };
      this.setData({
        totalNum: num,
        change: false
      });
      this.triggerEvent('StepperEvent', myEventDetail);
    }
  }
});