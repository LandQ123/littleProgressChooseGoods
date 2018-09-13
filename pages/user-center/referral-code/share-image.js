module.exports = () => {
  const app = getApp()
  const userInfo = app.globalData.userInfo
  const referQrcode = wx.getStorageSync('referQrcode')

  return ({
    width: '690rpx',
    height: '920rpx',
    background: '/assets/images/refer-code-bg.png',
    borderRadius: '20rpx',
    views: [{
        type: 'image',
        url: userInfo.avatarUrl,
        css: {
          top: '40rpx',
          left: '20rpx',
          borderRadius: '48rpx',
          width: '96rpx',
          height: '96rpx'
        }
      },
      {
        type: 'text',
        text: userInfo.nickName,
        css: [{
          top: '40rpx',
          left: '140rpx',
          width: '400rpx',
          fontSize: '32rpx',
          color: '#333'
        }]
      },
      {
        type: 'image',
        url: referQrcode,
        css: {
          top: '367rpx',
          left: '105rpx',
          width: '480rpx',
          height: '480rpx',
        }
      }
    ]
  })
}