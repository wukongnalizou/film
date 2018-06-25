// pages/canvasedit/canvasedit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "",
    width: "",
    windowwidth: "",
    condition: false,
    mag: "zhuangtai ",
    prompttitle: "保存成功",
    prompt: false,
    gameresult:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    })
    app.https('/gamevideoinfo/gameresult', {
      game_id: options.id,
      openid: app.globalData.openid
    }, res => {
      if(res.status == 2000){
        res.data.game.pic = app.urlimg(res.data.game.pic);
        this.setData({
          gameresult : res.data
        })
      }
    })
    // wx.getSystemInfo({
    //   success: res => {
    //     // 可使用窗口宽度、高度
    //     // 计算主体部分高度,单位为px
    //     this.setData({
    //       width: res.windowWidth,
    //       height: res.windowHeight,
    //       statusBarHeight: res.screenHeight - res.windowHeight
    //       // windowwidth: 750 * res.windowWidth / 750 / 2
    //     })
    //     this.drawcanvas();
    //   }
    // })
  },
  getgameresult:function(){
    
  },
  drawcanvas: function () {
    let ctx = wx.createCanvasContext('canvasedit');
    ctx.drawImage("../../img/bac.jpg", 0, 0, this.data.width, this.data.height);
    ctx.setFontSize(this.setpx(72));
    ctx.setFillStyle('#fff');
    ctx.fillText('举世无双', this.setpx(60), this.setpx(188));
    ctx.setFontSize(this.setpx(24));
    ctx.fillText('|', this.setpx(385), this.setpx(197));
    ctx.fillText('不要骄傲，再接再厉！', this.setpx(405), this.setpx(196));
    ctx.setFontSize(this.setpx(150));
    ctx.setFillStyle('#FFD508');
    ctx.fillText('95', this.setpx(60), this.setpx(360));
    ctx.setFontSize(this.setpx(33));
    ctx.setFillStyle('#fff');
    ctx.fillText('分', this.setpx(240), this.setpx(360));
    ctx.setFontSize(this.setpx(24));
    ctx.setFillStyle('#FFD508');
    ctx.fillText('性格分析：', this.setpx(60), this.setpx(458));
    ctx.setFillStyle('#fff');
    ctx.fillText('性格分析性格分析性格分析性格分析性格分析性格分析哈哈', this.setpx(60), this.setpx(503));
    ctx.fillText('性格分析性格分析性格分析性格分析性格分析性格分析哈哈', this.setpx(60), this.setpx(543));
    ctx.fillText('性格分析性格分析性格分析性格分析性格分析性格分析哈哈', this.setpx(60), this.setpx(583));
    ctx.fillText('性格分析性格分析性格分析性格分析性格分析性格分析性格', this.setpx(60), this.setpx(623));
    ctx.fillText('性格分析性格分析性格分析性格分析性格分析性格分析性格', this.setpx(60), this.setpx(663));
    // ctx.fillText('分享给', this.setpx(30), this.setpx(756));
    // ctx.setFillStyle('#FF5555');
    // ctx.fillText('异性', this.setpx(105), this.setpx(756));
    // ctx.setFillStyle('#fff');
    // ctx.fillText('好友看看你们的契合度吧！', this.setpx(155), this.setpx(756));
    // ctx.drawImage("../../img/eweima.png", this.setpx(30), this.setpx(847), this.setpx(211), this.setpx(211));
    ctx.draw()
  },
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  },
  tap: function () {
    console.log("11");
    console.log(this.setpx(this.data.width * 4));
    console.log(this.setpx(this.data.height * 4));
    console.log(this.setpx(this.data.width * 4));
    console.log(this.setpx(this.data.height * 4));
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.setpx(this.data.width * 4),
      height: this.setpx(this.data.height * 4),
      destWidth: this.setpx(this.data.width * 4),
      destHeight: this.setpx(this.data.height * 4),
      canvasId: 'canvasedit',
      success: function (res) {
        that.setData({
          mag: "wenjiandizhi"
        });
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            that.setData({
              prompt: true
            });

          },
          fail: function (res) {
            that.setData({
              mag: res
            });
            wx.openSetting({
              success(settingdata) {
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  that.setData({
                    mag: "获取权限成功，再次点击图片保存到相册"
                  });
                } else {
                  that.setData({
                    mag: "获取权限失败"
                  });
                }
              }
            })
          }
        })
      },
      fail: function () {
      }
    })
  },
  switchcondition: function () {
    console.log("111");
    var that = this;
    that.setData({
      condition: true
    })
  },
  sharemore: function () {
    var that = this;
    // that.setData({
    //   condition: true
    // });
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      condition: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  shareless: function () {
    var that = this;
    // that.setData({
    //   condition: false
    // });
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        condition: false
      })
    }, 200)
  },
  promptnone: function () {
    var that = this;
    that.setData({
      prompt: false
    });
  }
})