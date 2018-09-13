// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    showHeader: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '模态框标题'
    },
    showFooter: {
      type: Boolean,
      value: false
    },
    showConfirmButton: {
      type: Boolean,
      value: true
    },
    confirmButtonText: {
      type: String,
      value: '确定'
    },
    confirmButtonOpenType: {
      type: String,
      value: ''
    },
    showCancelButton: {
      type: Boolean,
      value: false
    },
    cancelButtonText: {
      type: String,
      value: '取消'
    }
  },

  externalClasses: ['confirm-btn-cls', 'cancel-btn-cls'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirmTap() {
      this.triggerEvent('confirm')
    },
    cancelTap() {
      this.triggerEvent('cancel')
    }
  }
})
