// pages/type/type.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // switchtab:true,
    videos:[]
  },
  switchtab: function(){
    this.setData({
      switchtab:!this.data.switchtab
    })
  },
  todetail:function(e){
    if (e.currentTarget.dataset.state){
      wx.navigateTo({
        url: '../assess/assess?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
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
  },
  getvideos: function(){
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  
  }
})