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
    gameresult:{},
    gamepic:"",
    thisbacimg:'',
    matestate:false,
    clearsharelock: 0,
    alertdialog: false, //分享
    cardstate: false,
    concern:false,
    typeitem:{},
    concern:false,
    pageli:[],
    gameresult_state:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.gameresult_state = options.state
    wx.setNavigationBarTitle({
      title: options.name,
    })
    // console.log(options.id);
    app.https('/gamevideoinfo/gameresult', {
      game_id: options.id,
      openid: app.globalData.openid
    }, res => {
      if(res.status == 2000){
        res.data.game.pic = app.urlimg(res.data.game.pic);
        this.setData({
          gameresult : res.data,
          gamepic: res.data.game.pic,
          clearsharelock: res.data.clearsharelock
        })
        if (!this.data.gameresult_state){
          setTimeout(() => {
            this.setData({
              matestate: true
            })
          }, 4000)
        }
      }
      
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
    })
   
  },
  writedis:function(){
    wx.navigateTo({
      url: '../writedis/writedis?id=' + this.data.gameresult.game.game_id,
    })
  },
  drawcanvas: function () {
    let ctx = wx.createCanvasContext('canvasedit');
    let ctxtext = this.data.gameresult.result.content;
    let arr = [];
    let index = 0;
    var that = this;
    let arrctxtext = [];
    let arritem = [];
    let num = 0;
    arrctxtext = ctxtext.split("<br>");
    
    if (arrctxtext.length > 1) {
      for (let i = 0; i < arrctxtext.length; i++) {
        if (arrctxtext[i].length < 26) {
          arritem[i] = arrctxtext[i].substring(0, arrctxtext[i].length);
          
          ctx.fillText(arrctxtext[i].substring(0, arrctxtext[i].length), that.setpx(60), that.setpx(503 + 40 * num));
          num += 1;
          index += 22
        } else {
          let numnum = 0;
          
          for (var y = 0; y < parseInt(arrctxtext[i].length / 22 + 1); y++) {
            
            arritem[i] = arrctxtext[i].substring(y * 26, y * 26 + 26);
            // ctx.fillText(arrctxtext[i].substring(y * 26, y * 26 + 26), that.setpx(60), that.setpx(503 + 40 * num))
            num += 1;
          }


          index += 22
        }

      }
    } else {
      arritem[0] = ctxtext;
      
      // ctx.fillText(arritem[0], that.setpx(60), that.setpx(503))
    }
    that.setData({
      pageli: arritem
    });
    
    wx.downloadFile({
      url: that.data.gameresult.game.pic, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          that.setData({
            thisbacimg: res.tempFilePath
          });
          ctx.drawImage(res.tempFilePath, 0, 0, that.data.width, that.data.height);
          ctx.setFillStyle('#000');
          ctx.setGlobalAlpha(0.7);
          ctx.fillRect(0, 0, that.data.width, that.data.height);
          ctx.setFillStyle('#fff');
          ctx.setFontSize(that.setpx(24));
          let numst = 0;
          if (arrctxtext.length > 1) {
            for (let i = 0; i < arrctxtext.length; i++) {
              if (arrctxtext[i].length < 27) {
                ctx.fillText(arrctxtext[i].substring(0, arrctxtext[i].length), that.setpx(60), that.setpx(503 + 40 * numst));
                numst += 1;
                index += 27
              } else {
                let numnum = 0;
                for (var y = 0; y < parseInt(arrctxtext[i].length / 27 + 1); y++) {
                  ctx.fillText(arrctxtext[i].substring(y * 27, y * 27 + 27), that.setpx(60), that.setpx(503 + 40 * numst))
                  numst += 1;
                }


                index += 27
              }

            }
          } else {
            arritem[0] = ctxtext;
            if (arritem[0].length < 27) {
              ctx.fillText(arritem[0].substring(0, arritem[0].length), that.setpx(60), that.setpx(503 + 40 * numst));
              numst += 1;
              index += 27
            } else {
              let numnum = 0;
              for (var y = 0; y < parseInt(arritem[0].length / 27 + 1); y++) {
                ctx.fillText(arritem[0].substring(y * 27, y * 27 + 27), that.setpx(60), that.setpx(503 + 40 * numst))
                numst += 1;
              }


              index += 22
            }
            // ctx.fillText(arritem[0], that.setpx(60), that.setpx(503))
          }
          ctx.setFontSize(that.setpx(72));
          ctx.setFillStyle('#fff');
          ctx.fillText(that.data.gameresult.result.title, that.setpx(60), that.setpx(188));
          ctx.setFontSize(that.setpx(150));
          ctx.setFillStyle('#FFD508');
          ctx.fillText(that.data.gameresult.result_score, that.setpx(60), that.setpx(360));
          ctx.setFontSize(that.setpx(33));
          ctx.setFillStyle('#fff');
          ctx.fillText('分', that.setpx(240), that.setpx(360));
          ctx.setFontSize(that.setpx(24));
          ctx.setFillStyle('#FFD508');
          ctx.fillText('性格分析：', that.setpx(60), that.setpx(458));
          ctx.setFillStyle('#fff');
          // ctx.drawImage("../../img/erweima.png", that.setpx(60), that.setpx(847), that.setpx(210), that.setpx(210));
          // ctx.drawImage("../../img/qihedu.png", that.setpx(291), that.setpx(940), that.setpx(315), that.setpx(104));
          ctx.draw()
        }
      }
    }) 
  },
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  },
  tap: function () {
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
            wx.showToast({
              title: '已保存到本地',
              icon: 'success',
              duration: 2000
            })

          },
          fail: function (res) {
            that.setData({
              mag: res
            });
            wx.openSetting({
              success(settingdata) {
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  wx.showToast({
                    title: '已保存到本地',
                    icon: 'success',
                    duration: 2000
                  })
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
    var that = this;
    that.setData({
      condition: true
    })
  },
  play: function () {
    // if (this.data.clearsharelock) {
    //   this.setData({
    //     cardstate: true
    //   })
    // } else {
    //   this.setData({
    //     alertdialog: true
    //   })
    // }
    wx.navigateTo({
      url: '../video/video?id=' + this.data.gameresult.game.game_id + '&name=' + this.data.gameresult.game.name,
    })
  },
  totype:function(e){
    wx.navigateTo({
      url: '../type/type?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name
    })
  },
  unlock: function () {
    this.setData({
      cardstate: false
    })
    wx.navigateTo({
      url: '../video/video?id=' + this.data.gameresult.game.game_id + '&name=' + this.data.gameresult.game.name,
    })
  },
  closealert: function () {
    this.setData({
      alertdialog: false
    })
  },
  closemate:function(){
    this.setData({
      matestate:false
    })
  },
  showcon:function(){
    this.setData({
      condition:false,
      concern: true
    })
  },
  toindex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  closeconcern: function () {
    this.setData({
      concern: false
    })
  },
  showshare:function(){
    app.https('/matelist/friendpic', res => {
      if (res.status == 2000) {
        res.data.pic = app.urlimg(res.data.pic)
        this.setData({
          typeitem: res.data
        })
        this.sharemore();
      }
    })
  },
  sharemore: function () {
    var that = this;
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
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
    this.setData({
      condition: false
    })
  },
  promptnone: function () {
    var that = this;
    that.setData({
      prompt: false
    });
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.setting.wx_share,
      path: '/pages/video/video?user=' + app.globalData.openid + '&id=' + this.data.gameresult.game.game_id + '&name=' + this.data.gameresult.game.name,
      imageUrl: app.urlimg(app.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          app.https('/gamevideoinfo/sharegamevideo', {
            game_id: this.data.gameresult.game.game_id,
            openid: app.globalData.openid
          }, res => {
            if (res.status == 2000) {
              this.setData({
                alertdialog: false,
                // cardstate: true
              })
            }
          })
        }
      }
    }
  }
})