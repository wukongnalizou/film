// pages//writedis/writedis.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
    ],
    writedata:"",
    starnum:0,
    nodis:true,
    gameid:"",
    comstate:0,
  },
  subdis:function(){
    if (!this.data.nodis){
      if(this.data.comstate){
        app.https('/comment/reusergamescore',{
          game_id: this.data.gameid,
          openid: app.globalData.openid,
          gamecomment: this.data.writedata,
          gamescore: this.data.starnum
        }, res => {
          if(res.status == 2000){
            this.setData({
              stars: [
                "bstarwhite",
                "bstarwhite",
                "bstarwhite",
                "bstarwhite",
                "bstarwhite",
              ],
              writedata: ""
            })
            wx.showToast({
              title: res.data,
              icon: "none",
              duration: 2000
            });
          }
        })
      }else{
        app.https('/comment/usergamescore', {
          openid: app.globalData.openid,
          game_id: this.data.gameid,
          gamescore: this.data.starnum,
          gamecomment: this.data.writedata
        }, res => {
          if (res.status == 2000) {
            this.setData({
              stars: [
                "bstarwhite",
                "bstarwhite",
                "bstarwhite",
                "bstarwhite",
                "bstarwhite",
              ],
              writedata: ""
            })
            wx.showToast({
              title: res.data,
              icon: "none",
              duration: 2000
            });
          }
        })
      } 
    }
  },
  writedis:function(e){
    let inputnull = this.isNull(e.detail.value)
    this.setData({
      nodis:inputnull,
      writedata: e.detail.value
    })
  },
  selestar: function (e) {
    let stars = [
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
      "bstarwhite",
    ]
    for (let i = 0; i <= e.currentTarget.dataset.num-1; i++) {
      stars[i] = "bstaryellow"
    }
    this.setData({
      stars: stars,
      starnum: e.currentTarget.dataset.num
    })
  },
  isNull:function(str) {
    if(str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.gameid = options.id
    app.https('/comment/usergamescore_one',{
      game_id: options.id,
      openid: app.globalData.openid
    }, res => {
      if(res.status == 2000){
        let nodis = true;
        if (res.data.com_state) nodis = false
        let stars = [
          "bstarwhite",
          "bstarwhite",
          "bstarwhite",
          "bstarwhite",
          "bstarwhite",
        ]
        for (let i = 0; i <= res.data.score-1; i++) {
          stars[i] = "bstaryellow"
        }
        this.setData({
          starnum : res.data.score,
          writedata : res.data.game_com,
          stars : stars,
          comstate: res.data.com_state,
          nodis: nodis
        })
      }
    })
  }
})