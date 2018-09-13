/**
 * @author swan
 * @file 列表选择项
 * @desc 列表选择项
 * @since 2018/6/14
 */
Component({
  externalClasses: ['list-cls'],
  properties: {
    data: {
      type: Array,
      value: []
    }
  },
  data: {
    checkedIndex: ''
  },
  methods: {
    handleCheck: function (e) {
      let index = e.currentTarget.dataset.index
      let obj = Object.assign({}, {
        index: index,
        data: this.properties.data[index]
      })
      this.setData({
        checkedIndex: index
      })
      this.triggerEvent('change', obj)
      let timer = setTimeout(function () {
        timer = null
        wx.navigateBack()
      }, 100)
    }
  }
})