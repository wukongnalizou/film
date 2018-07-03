// pages/fit/fit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    height:0,
    openinfo:{},
    datainfo:{},
    userinfo:{},
    myhead:"",
    matehead:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.openinfo = options;
    this.data.userinfo = app.globalData.userinfo;
    this.getinfo(res => {
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

          this.saveimg();
        }
      })
    })
    
  },
  getinfo:function(fn){
    app.https('/matelist/friendmatepic', {
      openid: app.globalData.openid,
      friend_openid: this.data.openinfo.id,
      game_id: this.data.openinfo.gameid
    }, res => {
      if (res.status == 2000) {
        this.setData({
          datainfo : res.data
        })
        if(fn) fn(res.data);
      }
    })
  },
  saveimg:function(){
    var that = this;
    wx.getImageInfo({
      src: that.data.userinfo.headimg, //仅为示例，并非真实的资源
      success: res=> {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容


        that.data.myhead = res.path;
            wx.getImageInfo({
              src: that.data.datainfo.friend_hendimg, //仅为示例，并非真实的资源
            success: res => {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              this.data.matehead = res.path;

                this.drawcanvas();
                // this.setData({
                //   matehead: res.tempFilePath
                // });
            }
          })
      }
    })
  },
  drawcanvas: function(){
    var that = this;
    let ctx = wx.createCanvasContext('myCanvas');
    // ctx.drawImage(path, this.setpx(430), this.setpx(380), this.setpx(200), this.setpx(200));
    ctx.drawImage("../../img/url.jpg", 0, 0, this.data.width, this.data.height);
    ctx.setFontSize(this.setpx(180));
    ctx.setFillStyle('#824DF7');
    ctx.fillText(this.data.datainfo.pic_content.score, this.setpx(270), this.setpx(329));
    ctx.setFillStyle('#FFB12A');
    ctx.fillText(this.data.datainfo.pic_content.score, this.setpx(260), this.setpx(329));
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
    ctx.drawImage(this.data.myhead, this.setpx(136), this.setpx(380), this.setpx(200), this.setpx(200));
    ctx.drawImage(this.data.matehead, this.setpx(430), this.setpx(380), this.setpx(200), this.setpx(200));
    
    // ctx.drawImage(this.data.datainfo.friend_hendimg, this.setpx(136), this.setpx(380), this.setpx(200), this.setpx(200));
    // ctx.drawImage(this.data.userinfo.headimg, this.setpx(430), this.setpx(380), this.setpx(200), this.setpx(200));
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

    if (this.data.userinfo.nick.length>3){

    }
    let nickname = this.data.userinfo.nick.length;
    let nicklength = parseInt((nickname-3)*12);
    let personname = this.data.datainfo.friend_nick.length;
    let personlength = parseInt((personname - 3) * 12);
    ctx.fillText(this.data.userinfo.nick, this.setpx(200 - nicklength) , this.setpx(610));//12 一个字符
    ctx.fillText(this.data.datainfo.friend_nick, this.setpx(500 - personlength), this.setpx(610));
    let num = 0;
    let index = 0;
    let ctxtext = this.data.datainfo.pic_content.content;
    let arrctxtext = [];
    arrctxtext = ctxtext.split("<br>");
    for (let i = 0; i < arrctxtext.length; i++) {
      if (arrctxtext[i].length < 22){
        ctx.fillText(arrctxtext[i].substring(0, arrctxtext[i].length), that.setpx(120), that.setpx(680 + 30 * num));
        num += 1;
        index += 22
      }else{
        // if (arrctxtext[i].length % 22 == 0){
          let numnum = 0;
          for(var y=0;y<parseInt(arrctxtext[i].length / 22 +1);y++){
            ctx.fillText(arrctxtext[i].substring(y * 22, y * 22 + 22), that.setpx(120), that.setpx(680 + 30 * num))
            num += 1;
          }
          index += 22
        // }
      }
      
    }
    ctx.draw()
  },
  setpx: function (rpx) {
    return rpx*(this.data.width / 750)
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
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
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
                    title: '保存成功',
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
  }
})