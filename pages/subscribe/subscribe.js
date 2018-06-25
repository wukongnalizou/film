// pages/subscribe/subscribe.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasdata:true,
    sub:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.https('/subscribe',{
      open_id: app.globalData.openid
    },res => {
      if(res.status == 2000){
        let sub = res.data;
        for (let i = 0; i < sub.length; i++) {
          sub[i].pic = app.urlimg(sub[i].pic);
        }
        this.setData({
          sub : sub
        })
      }
    })
  },
  totype:function(e){
    wx.navigateTo({
      url: '../type/type?id=' + e.target.dataset.id + '&name=' + e.target.dataset.name,
    })
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