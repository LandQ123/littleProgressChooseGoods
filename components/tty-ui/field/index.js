'use strict';

Component({
  behaviors: ['wx://form-field'],
  externalClasses: ['input-cls', 'textarea-cls'],
  properties: {
    required: {
      type: Boolean,
      value: false,
      desc: '是否为必填'
    },
    isLink: {
      type: Boolean,
      value: false,
      desc: '是否显示跳转图标'
    },
    hasLine: {
      type: Boolean,
      value: false,
      desc: '是否显示底部边框'
    },
    name: String,
    title: String,
    type: {
      type: String,
      value: 'input'
    },
    disabled: Boolean,
    inputType: {
      type: String,
      value: 'text'
    },
    placeholder: String,
    focus: Boolean,
    mode: {
      type: String,
      value: 'normal'
    },
    right: Boolean,
    error: Boolean,
    maxlength: {
      type: Number,
      value: 140
    }
  },

  methods: {
    handleFieldChange: function handleFieldChange(event) {
      var _event$detail = event.detail,
        detail = _event$detail === undefined ? {} : _event$detail;
      var _detail$value = detail.value,
        value = _detail$value === undefined ? '' : _detail$value;

      this.setData({
        value: value
      });
      let obj = Object.assign({}, event, {})
      this.triggerEvent('change', event);
    },
    handleFieldFocus: function handleFieldFocus(event) {
      this.triggerEvent('focus', event);
    },
    handleFieldBlur: function handleFieldBlur(event) {
      this.triggerEvent('blur', event);
    }
  }
});