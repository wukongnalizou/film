// pages/fit/fit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,
    show:false,
    animationData:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        this.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          statusBarHeight: res.screenHeight - res.windowHeight
          // windowwidth: 750 * res.windowWidth / 750 / 2
        })
        this.drawcanvas();
      }
    })
  },
  drawcanvas: function () {
    let ctx = wx.createCanvasContext('myCanvas');
    ctx.drawImage("../../img/url.jpg", 0, 0, this.data.width, this.data.height);
    ctx.setFontSize(this.setpx(48));
    ctx.setFillStyle('#000');
    ctx.fillText('话题终结者', this.setpx(270), this.setpx(200));
    ctx.setFontSize(this.setpx(180));
    ctx.setFillStyle('#824DF7');
    ctx.fillText('98', this.setpx(270), this.setpx(429));
    ctx.setFillStyle('#FFB12A');
    ctx.fillText('98', this.setpx(260), this.setpx(429));
    ctx.setFillStyle('#000');
    ctx.setFontSize(this.setpx(33));
    ctx.fillText('分', this.setpx(480), this.setpx(429));
    ctx.setFontSize(this.setpx(24));
    ctx.setFillStyle('#000');
    ctx.fillText('性格分析', this.setpx(330), this.setpx(550));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(600));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(630));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(660));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(690));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(720));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(750));
    ctx.drawImage("../../img/yixing.png", this.setpx(160), this.setpx(800), this.setpx(456), this.setpx(28));
    ctx.draw()
  },
  sharefriend: function () {
    
  },
  showshare: function () {
    var that = this;
    // that.setData({
    //   condition: true
    // });
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(this.setpx(348)).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      show: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideshare: function () {
    var that = this;
    // that.setData({
    //   condition: false
    // });
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(this.setpx(348)).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        show: false
      })
    }, 200)
  },
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  }
})