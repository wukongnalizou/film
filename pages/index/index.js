//主页
const app = getApp();
Page({
  userinfo:{},
  data: {
    concern:false,
    mate: false,
    swiperCurrent:0,
    gameCurrent:0,
    previousmargin:"50px",
    nextmargin:"50px",
    circular: true,
    autoplay:true,
    oauth: false,
    banners:[
      {
        id: "OVVGdjBqWEk4L0F1aW9yZlZXQVp3dz09",
        name: "潮人小罗",
        pchoose: "0",
        pic: "../../img/OVVGdjBqWEk4L0F1aW9yZlZXQVp3dz09.jpg",
        subscribe_state:0,
        subscribe_style:{
          sub:{
            bgcolor: "#8455E3",
            color: "#FFFFFF"
          },
          unsub:{
            bgcolor:"",
            bordercolor: "#8455E3",
            color: "#8455E3"
          }
        }
      },
      {
        id: "b1ZpaG9hNjJZM1g1dWZMckJ4OUFIZz09",
        name: "绅士阿兴",
        pchoose: "0",
        pic: "../../img/b1ZpaG9hNjJZM1g1dWZMckJ4OUFIZz09.jpg",
        subscribe_state: 0,
        subscribe_style:{
          sub: {
            bgcolor: "#FF5555",
            color: "#FFFFFF"
          },
          unsub: {
            bgcolor: "",
            bordercolor: "#FF5555",
            color: "#FF5555"
          }
        }
      }
    ],
    gameid:"",
    openid:"",
    newhand:1,
    newCurrent:0,
    // imgs : [
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner1.png",
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner2.png",
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner2.png"
    // ],
    hasmate: 0,
    matelist:[],
    friendlist:[],
    newswiper:[
      "../../img/new1.png",
      "../../img/new2.png",
      "../../img/new3.png"
    ]
  },
  onLoad:function(options){
    this.localbanner();
    this.data.openid = options.user;
    app.login(res => {
      if (app.globalData.oauth) {
        this.setData({
          oauth: true
        })
      } else {
        this.setData({
          oauth: false
        })
      }
      if (this.data.openid) {
        this.shareuser(res =>{
          this.getbanner(res => {
          });
        })
      } else {
        this.getbanner( res => {
        });
      }
    })


  },
  shareuser:function(fn){
    app.httpsOnce('/matelist/friendship', {
      sender: this.data.openid,
      openid: app.globalData.openid
    }, res => {
      if (res.status == 2000) {
        if(fn) fn();
      }
    })
  },
  getbanner: function (fn) {
    app.https('/project',{
      openid: app.globalData.openid
    }, res => {
      if (res.status == 2000) {
        // console.log(res)
        // let banners = res.data.resproject;
        // for (let i = 0; i < banners.length;i++){
        //   banners[i].pic = app.urlimg(banners[i].pic);
        // }
        if (!res.data.newhand_state){
          wx.hideTabBar({})
        }
        let localbanner = app.local.get("banner");
        app.local.set("banner", res.data.resproject);
        if (!localbanner) this.localbanner(res.data.resproject);
        this.setData({
          // banners: banners,
          hasmate: res.data.record_state,
          newhand: res.data.newhand_state,
        })
      }
      if (fn) fn();
    })
  },
  localbanner:function(newBanner){
    let localbanner = newBanner || app.local.get("banner")
    if (localbanner) {
      for (let banner of localbanner) {
        if (banner.pic == 'local') {
          banner.pic = `../../img/${banner.id}.jpg`
        } else {
          banner.pic = app.urlimg(banner.pic)
        }
      }
      this.setData({
        banners: localbanner
      })
    }
  },
  subscribe: function (e) {
    app.httpsOnce('/subscribe/subscribeProject',{
      open_id: app.globalData.openid,
      pro_id: e.target.dataset.id,
      state: e.target.dataset.state
    },res => {
      if(res.status == 2000){
        let bannerarray = this.data.banners
        bannerarray[e.target.dataset.index].subscribe_state = res.data.state
        this.setData({
          banners: bannerarray
        })
      }
    })
  },
  getinfo:function(res){
    let detail = res.detail;
    // console.log(detail)
    // console.log(111111111111111111111111111111111111111111111111111111111111)
    if (detail.errMsg == "getUserInfo:fail auth deny") return;
    app.setUserInfo(detail,res => {
      this.setData({
        oauth: app.globalData.oauth
      })
      this.showmate();
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current   //获取当前轮播图片的下标
    })
  },
  newchange:function(e){
    this.setData({
      newCurrent: e.detail.current   //获取当前轮播图片的下标
    })
  },
  // chuangEvent: function (e) {
  //   console.log(chuangevent)
  //   this.setData({
  //     swiperCurrent: e.detail.current
  //   })
  // },
  totype: e => {
    // console.log(e);
    if (!app.globalData.openid) return
    wx.navigateTo({
      url: '../type/type?id='+e.target.id+'&name='+e.target.dataset.name
    })
  },
  showconcern : function(){
    this.setData({
      concern: true
    }) 
  },
  closeconcern: function(){
    this.setData({
      concern: false
    })
  },
  newstate:function(){
    app.httpsOnce('/gamevideoinfo/newhandending',{
      openid: app.globalData.openid,
    },res => {
      if(res.status == 2000){
        this.setData({
          newhand:1
        })
        wx.showTabBar({
          
        })
      }
    })
  },
  showmate: function() {
    this.setData({
      mate: true
    })
    app.https('/matelist',{
      openid: app.globalData.openid,
    },res => {
      if(res.status == 2000){
        this.setData({
          matelist: res.data
        })
        if(res.data.length != 0){
          this.matefriend();
        }
      }
    })
  },
  // matefriend: function (e) {
  //   let game_id = "";
  //   if (e) {
  //     game_id = e.currentTarget.dataset.id
  //     if (this.data.gameCurrent == e.currentTarget.dataset.index) return false;
  //   } else {
  //     game_id = this.data.matelist[0].game_id
  //   }
  //   console.log(e.currentTarget.dataset.index)
  //   app.https('/matelist/friendmate', {
  //     openid: app.globalData.openid,
  //     game_id: game_id
  //   }, res => {
  //     if (res.status == 2000) {
  //       this.setData({
  //         friendlist: res.data,
  //         matefriend: e.currentTarget.dataset.index
  //       })
  //     }
  //   })
  // },
  matefriend:function(e){
    if(e){
      this.data.gameid = e.currentTarget.dataset.id;
      if (this.data.gameCurrent == e.currentTarget.dataset.index){
        return false;
      }else{
        app.https('/matelist/friendmate', {
          openid: app.globalData.openid,
          game_id: e.currentTarget.dataset.id
        }, res => {
          if (res.status == 2000) {
            this.setData({
              friendlist: res.data,
              gameCurrent: e.currentTarget.dataset.index
            })
          }
        })
      }
    }else{
      this.data.gameid = this.data.matelist[0].game_id;
      app.https('/matelist/friendmate', {
        openid: app.globalData.openid,
        game_id: this.data.matelist[0].game_id
      }, res => {
        if (res.status == 2000) {
          this.setData({
            friendlist: res.data,
            gameCurrent: 0
          })
        }
      })
    }
  },
  makephoto:function(e){
    // console.log(e)
    wx.navigateTo({
      url: '../fit/fit?id=' + e.currentTarget.dataset.id + '&gameid=' + e.currentTarget.dataset.gameid,
    })
  },
  closemate: function(){
    this.setData({
      mate: false
    })
  },
  setpx: function (rpx) {
    return rpx * (this.data.width / 750)
  }, 
  onShareAppMessage: function () {
    return {
      title: app.globalData.setting.wx_share,
      path: '/pages/index/index?user=' + app.globalData.openid,
      imageUrl: app.urlimg(app.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          app.https('/gamevideoinfo/sharegamevideo', {
            game_id: this.data.gameid,
            openid: app.globalData.openid
          }, res => {
            if (res.status == 2000) {
              wx.showToast({
                title: '邀请成功',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    }
  }
});