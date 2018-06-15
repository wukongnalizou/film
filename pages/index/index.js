//主页
const APP = getApp();
Page({
  data: {
    concern:false,
    mate: false,
    swiperCurrent:1,
    previousmargin:"50px",
    nextmargin:"50px",
    circular: true,
    autoplay:true,
    imgs : [
      "http://video.cdn.edisonluorui.com/filmimgs/banner1.png",
      "http://video.cdn.edisonluorui.com/filmimgs/banner2.png",
      "http://video.cdn.edisonluorui.com/filmimgs/banner2.png"
    ],
    hasmate:false
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current   //获取当前轮播图片的下标
    })
  },
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  totype: e => {
    wx.navigateTo({
      url: '../type/type?id='+e.target.id
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
  },
  closemate: function(){
    this.setData({
      mate: false
    })
  }
});