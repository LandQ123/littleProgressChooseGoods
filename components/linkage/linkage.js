// components/linkage/linkage.js
Component({
  externalClasses: ['content-class','goods-class'],
  properties: {
    data: {
      type: Array,
      value: []
    },
    procurement: { //是否采购页数据
      type: Boolean,
      value: false
    },
    management: { //是否管理页数据
      type: Boolean,
      value: false
    },
    order: { //是否开单页
      type: Boolean,
      value: false
    }
  },
  data: {
    contentActive: '', // 内容栏id
    navActive: 0, // 导航栏选中id
    heightArr: [],
    containerH: 0,
    defaultImg: '../../assets/images/goods-img-default.png'
  },
  ready() {
    let query = wx.createSelectorQuery().in(this);
    let heightArr = [];
    let s = 0;
    query.selectAll('.pesticide').boundingClientRect((react) => {
      react.forEach((res) => {
        s += res.height;
        heightArr.push(s)
      });
      this.setData({
        heightArr: heightArr
      })
    });
    query.select('.content').boundingClientRect((res) => {
      // 计算容器高度
      this.setData({
        containerH: res.height
      })
    }).exec()
  },
  methods: {
    chooseType(e) {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      this.setData({
        contentActive: id,
        navActive: index
      })
    },
    onScroll(e) {
      let scrollTop = e.detail.scrollTop;
      let scrollArr = this.data.heightArr;
      if (scrollTop >= scrollArr[scrollArr.length - 1] - this.data.containerH) {
        return
      } else {
        for (let i = 0; i < scrollArr.length; i++) {
          if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
            this.setData({
              navActive: 0
            })
          } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
            this.setData({
              navActive: i
            })
          }
        }
      }
    },
    tapHandle(e) {
      let {
        management
      } = this.properties
      if (management) {
        this.triggerEvent('viewDetailFunc', {
          id: e.currentTarget.dataset.itemid
        })
      }
    },
    stepperEvent(e) {
      let myEventDetail = e.detail;
      if(myEventDetail.action === 'blur') return
      this.triggerEvent('ContentEvent', myEventDetail)
    }
  }
});
