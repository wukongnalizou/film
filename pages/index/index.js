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
    oauth: app.globalData.oauth,
    banners:[],
    openid:"",
    // imgs : [
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner1.png",
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner2.png",
    //   "http://video.cdn.edisonluorui.com/filmimgs/banner2.png"
    // ],
    hasmate: 0,
    matelist:[],
    friendlist:[]
  },
  onLoad:function(options){
    this.data.openid = options.user
    app.login(res => {
      if (this.data.openid) {
        this.shareuser(res =>{
          this.getbanner(res => {
          });
        })
      } else {
        this.getbanner(res => {
        });
      } 
    })
  },
  shareuser:function(fn){
    app.https('/matelist/friendship', {
      sender: this.data.openid,
      openid: app.globalData.openid
    }, res => {
      if (res.status == 2000) {
        if(fn) fn(res.data);
        console.log(0)
      }
    })
  },
  getbanner:function(fn){
    app.https('/project',{
      openid: app.globalData.openid
    },res => {
      if (res.status == 2000) {
        let banners = res.data.resproject;
        for (let i = 0; i < banners.length;i++){
          banners[i].pic = app.urlimg(banners[i].pic);
        }
        this.setData({
          banners: banners,
          hasmate: res.data.record_state
        })
      }
      if (fn) fn();
    })
  },
  subscribe: function (e) {
    console.log(e)
    app.https('/subscribe/subscribeProject',{
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
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  totype: e => {
    // console.log(e);
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
        this.matefriend();
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
              matefriend: e.currentTarget.dataset.index
            })
          }
        })
      }
    }else{
      app.https('/matelist/friendmate', {
        openid: app.globalData.openid,
        game_id: this.data.matelist[0].game_id
      }, res => {
        if (res.status == 2000) {
          this.setData({
            friendlist: res.data,
            matefriend: 0
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
  }
});