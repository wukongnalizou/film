// pages/detail/detail.js
const app = getApp();
Page({
  data: {
    dialog:false,
    alertdialog:false, //分享
    cardstate:false,
    alertbtn:"找朋友",
    free : true,
    discuss:false,
    distext:true,
    clearsharelock:0,
    oauth: 0,
    stars: [
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
    ],
    video:{},
    starnum:3,
    disdata:[],
    concern:false
  },
  onLoad: function (options) {
    if (app.globalData.oauth){
      this.setData({
        oauth: true
      })
    }else{
      this.setData({
        oauth: false
      })
    }
    wx.setNavigationBarTitle({
      title: options.name,
    })
    app.https('/gamevideoinfo/clickgamevideo',{
      game_id : options.id,
      openid: app.globalData.openid
    },res => {
      if(res.status == 2000){
        res.data.pic = app.urlimg(res.data.pic);
        this.setData({
          video: res.data,
          clearsharelock: res.data.clearsharelock,
          starnum: parseInt(res.data.score)
        })
        this.selestar();
      }
    })
  },
  selestar: function () {
    let stars = [
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
      "lstargray",
    ]
    for (let i = 0; i <= this.data.starnum-1; i++) {
      stars[i] = "lstaryellow"
    }
    this.setData({
      stars: stars
    })
  },
  closeshare:function(){
    this.setData({
      dialog:false
    })
  },
  getinfo: function (res) {
    let detail = res.detail;
    if (detail.errMsg == "getUserInfo:fail auth deny") return;
    app.setUserInfo(detail, res => {
      this.setData({
        oauth: app.globalData.oauth
      })
      this.play();
    })
  },
  play:function(){
    // if (this.data.clearsharelock){
    //   this.setData({
    //     cardstate: true
    //   })
    // }else{
    //   this.setData({
    //     alertdialog: true
    //   })
    // }
    wx.navigateTo({
      url: '../video/video?id=' + this.data.video.game_id + '&name=' + this.data.video.name,
    })
  },
  closealert:function(){
    this.setData({
      alertdialog : false
    })
  },
  unlock:function(){
    this.setData({
      cardstate: false
    })
    wx.navigateTo({
      url: '../video/video?id=' + this.data.video.game_id + '&name=' + this.data.video.name,
    })
  },
  showdiscuss: function () {
    this.setData({
      discuss: true
    })
  },
  closediscuss:function(){
    this.setData({
      discuss: false
    })
  },
  write:function(){
    this.setData({
      distext: true
    })
  },
  toindex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  showconcern: function () {
    this.setData({
      concern: true
    })
  },
  closeconcern: function () {
    this.setData({
      concern: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.setting.wx_share ,
      path: '/pages/index/index?user=' + app.globalData.openid,
      imageUrl: app.urlimg(app.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          app.https('/gamevideoinfo/sharegamevideo', {
            game_id: this.data.video.game_id,
            openid: app.globalData.openid
          }, res => {
            if (res.status == 2000) {
              this.setData({
                alertdialog: false,
                cardstate: true
              })
            }
          })
        }
      }
    }
  }
})