// pages/fit/fit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    height:0
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
  drawcanvas: function(){
    let ctx = wx.createCanvasContext('myCanvas');
    ctx.drawImage("../../img/url.jpg", 0, 0, this.data.width, this.data.height);
    ctx.setFontSize(this.setpx(180));
    ctx.setFillStyle('#824DF7');
    ctx.fillText('98', this.setpx(270), this.setpx(329));
    ctx.setFillStyle('#FFB12A');
    ctx.fillText('98', this.setpx(260), this.setpx(329));
    ctx.setFillStyle('#000');
    ctx.setFontSize(this.setpx(33));
    ctx.fillText('%', this.setpx(480), this.setpx(338));
    ctx.drawImage("../../img/fitarrow.png", this.setpx(346), this.setpx(450), this.setpx(73), this.setpx(50));
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.setpx(236), this.setpx(480), this.setpx(100), 0, Math.PI * 2);
    ctx.setFillStyle("#FFD75F");
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.setpx(530), this.setpx(480), this.setpx(100), 0, Math.PI * 2);
    ctx.setFillStyle("#4D59F7");
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.setpx(236), this.setpx(480), this.setpx(88), 0, Math.PI * 2);
    ctx.arc(this.setpx(530), this.setpx(480), this.setpx(88), 0, Math.PI * 2);
    // ctx.fill();
    ctx.clip();
    ctx.drawImage("../../img/logo.jpg", this.setpx(136), this.setpx(380), this.setpx(200), this.setpx(200));
    ctx.drawImage("../../img/logo.jpg", this.setpx(430), this.setpx(380), this.setpx(200), this.setpx(200));
    ctx.restore();
    
    // ctx.save();
    // ctx.beginPath();
    // ctx.arc(this.setpx(530), this.setpx(480), this.setpx(88), 0, Math.PI * 2);
    // ctx.fill();
    // ctx.clip();
    // ctx.drawImage("../../img/logo.jpg", this.setpx(436), this.setpx(380), this.setpx(200), this.setpx(200));
    // ctx.restore();
    ctx.setFontSize(this.setpx(24));
    ctx.setFillStyle('#000');
    ctx.fillText('嘻洗洗', this.setpx(200), this.setpx(610));//12 一个字符
    ctx.fillText('哈哈哈', this.setpx(500), this.setpx(610));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(680));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(710));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(740));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(770));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(800));
    ctx.fillText('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', this.setpx(130), this.setpx(830));
    ctx.drawImage("../../img/secec.png", this.setpx(190), this.setpx(920), this.setpx(430), this.setpx(100));
    ctx.draw()
  },
  setpx: function (rpx) {
    return rpx*(this.data.width / 750)
  }
})