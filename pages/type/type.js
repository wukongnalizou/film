// pages/type/type.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // switchtab:true,
    videos:[],
  },
  switchtab: function(){
    this.setData({
      switchtab:!this.data.switchtab
    })
  },
  todetail:function(e){
    if (e.currentTarget.dataset.state){
      wx.navigateTo({
        url: '../assesscopy/assesscopy?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name+'&state=1',
      })
    }else{
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
      })
    }
    
  },
  tomore:function(){
    wx.navigateTo({
      url: '../typemore/typemore',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    })
    app.https('/project/projectgame', {
      openid: app.globalData.openid,
      pro_id: options.id
    }, res => {
      if(res.status == 2000){
        let videos = res.data;
        for (let i = 0; i < videos.length; i++) {
          videos[i].pic = app.urlimg(videos[i].pic);
        }
        this.setData({
          videos: videos
        })
      } 
    })
    // console.log(options.id)
  }
})