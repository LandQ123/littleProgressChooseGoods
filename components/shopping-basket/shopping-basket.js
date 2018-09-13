// components/shopping-basket/shopping-basket.js
Component({
    externalClasses: ['my-btn','my-basket','my-basket-list'],
    properties: {
        goodsData: {
            type: Array,
            value: [],
            desc: '购物框数据'
        },
        pageTotalNum: {
            type: Number,
            value: 0,
            desc: '购物框总数'
        },
        pageTotalMoney: {
            type: String,
            value: '',
            desc: '购物框总价'
        },
        showBasket: {
            type: Boolean,
            value: true,
            desc: '是否显示购物框'
        }
    },
    data: {
        showBack: false,
        showList: false,
    },
    methods: {
        showListHandle(e) {
            let that = this;
            this.setData({
                showBack: !this.data.showBack
            });
            if (this.data.showList) {
                this.setData({
                    showList: false
                })
            } else {
                setTimeout(() => {
                    that.setData({
                        showList: true
                    })
                }, 100)
            }
        },
        hideList(e) {
            this.setData({
                showBack: false,
                showList: false
            })
        },
        stopProp(e) {
        },
        stepperEvent(e) {
            let myEventDetail = e.detail;
            this.triggerEvent('BasketEvent', myEventDetail)
        },
        clearAll(e) {
            this.triggerEvent('ClearAll');
            this.setData({
                showBack: false,
                showList: false
            })
        },
        confirm() {
            this.triggerEvent('Confirm')
        }
    }
});
