const APP = getApp();
var ID = '';
var system = '';
var model = '';
var counttip = 0;
var version = '';
var local = false;
var iswebsocket = false;
Page({
  data: {
    concern: false,
    ending: "",
    score: 0,
    videos: [],
    loader: [],
    hide: [],
    action: [],
    options: [],
    showOption: false,
    duration: "",
    rightbottom: true,
    rotate: '',
    endanalyse: 1,
    sharetip: false,
    isvideostart: false,
    videoImage: '',
    isvideoimage: true,
    pis:''
  },
  max: 0,
  video: [],
  name: "start",
  playing: -1,
  playingName: "start",
  pointer: 0,
  paused: false,
  userChoosed: -1,
  onchoosing: [],
  nowPlay: -1,
  onended: [],
  userScore: {},
  CONFIG: {},
  game_id: '',
  titleName: '',
  user: '',
  openid: '',
  issharetip: true,
  onUnload: function() {
    APP.globalData.page = {};
    APP.https('/subscribe/disconnect', {
      open_id: APP.globalData.openid
    }, res => {
      if (res.status == '2000') {
        // console.log(res)
      }
    } );
  },
  onLoad: function (option) {
    console.log(option)
    let parem = option;
    this.game_id = ID = parem.id;
    APP.globalData.page = {
      page: "video",
      game_id: this.game_id,
      user: parem.user
    };
    APP.login(res => {
      this.openid = res.openid;
      this.titleName = parem.name;
      this.user = parem.user;
      //判断手机型号
      wx.getSystemInfo({
        success: res => {
          if (res.platform =="devtools") local = true;
          if ((res.windowWidth / res.windowHeight) <= 0.59) this.setData({
            pis: "iphoneX"
          });
          system = res.system.slice(4, 6);
          model = res.model;
          this.acceptright();
        }
      })
      // if (!this.user) APP.socketReconnect();
      iswebsocket = true;
    });
    wx.setNavigationBarTitle({
      title: option.name
    });
  },
  acceptright() {
    //如果用户踩别人链接，并且如果授权了，那么才能开始走接口
    if (this.user && this.openid){
      APP.https('/matelist/friendship', {
        sender: APP.globalData.openid,
        openid: this.user
      }, res => {
        console.log('accepcomplte')
        if (res.status == 2000) {
          console.log('acceptrightaccess')
          this.user = '';
          this.userplaygamevideo();
        }
      })
    }else{
      this.userplaygamevideo();
    }
  },
  userplaygamevideo() {
    APP.https('/gamevideoinfo/userplaygamevideo', {
      openid: APP.globalData.openid,
      game_id: this.game_id
    }, res => {
      if (res.status == '2000') {
        console.log('config')
        this.jiekou(res);
      }
    })
  },
  jiekou(res) {
    version = res.data.version;
    let data = res.data.setting;
    let orientation = res.data.orientation;
    let newhand = res.data.newhand;
    wx.setStorageSync('newhand', res.data.newhand);
    this.setData({ rotate: res.data.orientation });
    this.CONFIG = data;
    for (let key in this.CONFIG) {
      let config = this.CONFIG[key];
      if (config.ending || config.gotoPrev || key == "optionImage") continue;
      let len = config.choose.option.length;
      if (len > this.max) this.max = len;
    }
    this.max++;
    for (let i = 0; i < this.max; i++) {
      this.data.videos.push("");
    }
    this.setData({
      videos: this.data.videos
    });
    for (let i = 0; i < this.max; i++) {
      this.onchoosing[i] = 0;
      this.video[i] = wx.createVideoContext(`video${i}`);
    }
    this.play(0);
  },
  play: function (x) {
    let config = this.CONFIG[this.name];
    this.userChoosed = -1;
    if (config.ending) {
      this.playing = (this.playing + x + 1) % this.max;
      for (let j = 0; j < this.max; j++) {
        let i = (this.playing + j) % this.max;
        if (this.playing == i) {
          //播放
          this.onchoosing[i] = 0;
          this.data.loader[i] = {
            src: getVideo.call(this, this.name),
            poster: getPoster.call(this, this.name),
            name: this.name
          };
          this.data.hide[i] = false;
        }
        else {
          //禁用
          this.data.loader[i] = {
            src: "",
            poster: "",
            name: ""
          };
          this.data.hide[i] = true;
        }
      }
    }
    else if (config.gotoPrev) {
      if (this.data.loader.length == 0) {
        this.name = this.playingName;
        return this.play(0);
      }
      var pointer = (this.playing + x + 1) % this.max;
      for (let j = 0; j < this.max; j++) {
        let i = (pointer + j) % this.max;
        if (pointer == i) {
          //播放
          this.onchoosing[i] = 0;
          this.data.hide[i] = false;
        }
        else {
          //其他
          this.data.hide[i] = true;
        }
      }
    }
    else {
      this.playing = (this.playing + x + 1) % this.max;
      this.data.loader = [];
      this.pointer = (this.playing + config.choose.option.length) % this.max;
      let opi = 0;
      for (let j = 0; j < this.max; j++) {
        let i = (this.playing + j) % this.max;
        if (this.playing == i) {
          //播放
          this.onchoosing[i] = 0;
          this.data.loader[i] = {
            src: getVideo.call(this, this.name),
            poster: getPoster.call(this, this.name),
            name: this.name
          };
          //视频播放的时候就把最后一针的图片预载
          this.setData({ videoImage: getPoster.call(this, this.name) });
          this.data.hide[i] = false;
          if (this.data.rotate == 'landscape') {
            for (let i = 0; i < config.choose.option.length; i++) {
              config.choose.option[i].image = getOption(this.CONFIG.optionImage[this.name][i]);
            }
          }
          this.setData({
            options: config.choose.option
          });
        }
        else if (
          (this.playing < this.pointer && i > this.playing && i <= this.pointer) ||
          (this.playing > this.pointer && (i > this.playing || i <= this.pointer))
        ) {
          //预载
          this.data.loader[i] = {
            src: getVideo.call(this, config.choose.option[opi].next),
            poster: getPoster.call(this, config.choose.option[opi].next),
            name: config.choose.option[opi++].next
          };
          this.data.hide[i] = true;
        }
        else {
          //禁用
          this.data.loader[i] = {
            src: "",
            poster: "",
            name: ""
          };
          this.data.hide[i] = true;
        }
      }
    }
    let setDatas = {
      hide: this.data.hide
    };
    if (!config.gotoPrev) setDatas.loader = this.data.loader;
    this.nowPlay = config.gotoPrev ? pointer : this.playing;
    this.setData(setDatas);
    if (config.gotoPrev) this.video[pointer].play();
    else if (this.name != "start") this.video[this.playing].play();
    this.onended[this.nowPlay] = false;
    //控制保证video加载出来之后显示分享关注
    this.setData({ rightbottom: false });
  },
  ended: function (e) {
    let i = e.currentTarget.dataset.i;
    if (this.onended[i]) return;
    this.onended[i] = true;
    let config = this.CONFIG[this.name];
    //如果config.ending为真，最后一个视频，开始计分
    if (config.ending) {
      //为了保证一个游戏视频只能出现一次，所以在end的时候清空这个值
      counttip = 0;
      this.issharetip = true;
      this.setData({ endanalyse: 2 });
      let score = 0;
      let ending = config.ending;
      let endScore = ending;
      if (ending == "ending") {
        for (let i in this.userScore) {
          score += parseInt(this.userScore[i].score);
        }
        endScore = score;
      }
      //当玩完一个游戏，需要清空缓存中的内容
      this.name = 'start';
      this.playingName = 'start';
      this.userScore = {};
      wx.removeStorageSync('name_' + ID);
      wx.removeStorageSync('playingName_' + ID);
      wx.removeStorageSync('userScore_' + ID);
      let newhand = wx.getStorageSync('newhand');
      APP.https('/result/usergameresult', {
        openid: APP.globalData.openid,
        game_id: this.game_id,
        newhand: newhand,
        end: endScore
      }, res => {
        if (res.status == '2000') {
          wx.navigateTo({
            url: '../assesscopy/assesscopy?id=' + this.game_id + '&name=' + this.titleName
          });
          setTimeout(() => {
            this.setData({ endanalyse: 3 });
          }, 500);
        }
      });
    }
    else if (config.gotoPrev) {
      let prev = this.CONFIG[this.playingName];
      this.name = this.playingName;
      this.data.hide[i] = true;
      this.data.hide[this.playing] = false;
      this.video[i].pause();
      if (this.data.rotate == 'landscape') {
        for (let i = 0; i < prev.choose.option.length; i++) {
          prev.choose.option[i].image = getOption(this.CONFIG.optionImage[this.name][i]);
        }
      }
      this.setData({
        options: prev.choose.option,
        showOption: true,
        hide: this.data.hide
      });
      this.onchoosing[this.playing] = 1;
      this.nowPlay = this.playing;
      this.video[this.playing].seek(parseInt(prev.choose.at));
      this.video[this.playing].play();
      this.onended[this.playing] = false;
      this.paused = false;
    }
    else {
      if (config.choose.duration >= 0 || this.userChoosed != -1) {
        let choosed = this.userChoosed == -1 ? parseInt(config.choose.def) : this.userChoosed;
        this.name = config.choose.option[choosed].next;
        if (config.choose.duration >= 0 || this.userChoosed == config.choose.def) this.playingName = config.choose.option[choosed].next;
        this.setData({
          showOption: false
        });
        this.play(choosed);
      }
      else {
        this.paused = true;
        //如果暂停则暂停
        this.video[this.nowPlay].pause();
        this.setData({ isvideoimage: false });
      }
    }
  },
  onplaying: function (e) {
    let i = e.currentTarget.dataset.i;
    this.paused = false;
    if (i != this.nowPlay) this.video[i].pause();
  },
  timeupdate: function (e) {
    let currentTime = e.detail.currentTime;
    let duration = e.detail.duration;
    let i = e.currentTarget.dataset.i;
    let name = e.currentTarget.dataset.name;
    if (name != this.name) return;
    let config = this.CONFIG[this.name];
    if (config.ending || config.gotoPrev) {
      if (duration - currentTime <= 2 && !this.onended[i]) this.ended(e);
      return;
    }
    config.choose.at = parseInt(config.choose.at);
    config.choose.duration = parseInt(config.choose.duration);
    //需要显示分享提示，条件，弹框显示分享提示不显示，可以在config.choose.at之前，或者  
    //config.choose.at + config.choose.duration之后
    if ((counttip == 3) && (currentTime > (config.choose.at - 3)) && this.issharetip) {
      this.setData({ sharetip: true });
      setTimeout(() => {
        this.setData({ sharetip: false });
      }, 2000);
      this.issharetip = !this.issharetip;
    }
    if (config.choose.duration != 0) {
      if (currentTime >= config.choose.at && this.onchoosing[i] == 0) {
        //大于0或者等于-1
        counttip++;
        this.setData({
          showOption: true
        });
        this.onchoosing[i] = 1;
      }
      //如果duration为-1，那么必须选择一个选项
      if (config.choose.duration > 0) {
        if (currentTime >= config.choose.at + config.choose.duration && this.onchoosing[i] == 1) {
          this.setData({
            showOption: false
          });
          this.onchoosing[i] = 2;
        }
      }
    }
    if (duration - currentTime <= 2 && !this.onended[i]) this.ended(e);
  },
  userChoose: function (e) {
    let i = e.currentTarget.dataset.i;
    let config = this.CONFIG[this.name];
    this.userChoosed = parseInt(i);
    //罗哥的视频不需要统计分数，只需要abcd结果
    //双星的视频需要统计分数 -1是需要选择的 && config.choose.duration > 0
    if (config.choose.duration == -1) {
      let userScore = this.userScore[this.name] || {
        times: 0,
        score: 0
      };
      if (config.choose.score) {
        if (this.userChoosed == config.choose.def) userScore.score = config.choose.score[userScore.times] || 0;
        else userScore.times++;
        this.userScore[this.name] = userScore;
      }
    }
    this.setData({
      showOption: false
    });
    this.onchoosing[this.nowPlay] = 2;
    if (this.paused) {
      let config = this.CONFIG[this.name];
      this.name = config.choose.option[this.userChoosed].next;
      this.onchoosing[this.nowPlay] = 0;
      if (!config.choose.score || (config.choose.score && this.userChoosed == config.choose.def)) this.playingName = config.choose.option[this.userChoosed].next;
      this.play(this.userChoosed);
    }
  },
  controls: function () {
    if (this.onchoosing[this.nowPlay] == 1 || this.onended[this.nowPlay]) return;
    if (this.paused) {
      this.video[this.nowPlay].play();
      this.setData({ isvideostart: false });
    }
    else {
      this.video[this.nowPlay].pause();
      this.setData({ isvideostart: true });
    }

    this.paused = !this.paused;
  },
  gobackindex() {
    wx.switchTab({
      url: '../index/index',
      success: function () {
        //可以用来修改是否保存的状态
      }
    })
  },
  closeconcern() {
    this.setData({
      concern: false
    })
  },
  onHide: function () {
    iswebsocket = false;
    wx.setStorageSync('name_' + ID, this.name);
    wx.setStorageSync('playingName_' + ID, this.playingName);
    wx.setStorageSync('userScore_' + ID, this.userScore);
  },
  onShow: function () {
    if (!iswebsocket) {
      function checksuccess() {
        setTimeout(() => {
          if (APP.globalData.relogin){
            APP.socketReconnect()
          }else{
            checksuccess.call(this)
          }
        }, 500);
      }
      checksuccess.call(this)
    }
    this.name = wx.getStorageSync('name_' + ID) || 'start';
    this.playingName = wx.getStorageSync('playingName_' + ID) || 'start';
    this.userScore = wx.getStorageSync('userScore_' + ID) || {};
  },
  onShareAppMessage: function () {
    return {
      title: APP.globalData.setting.wx_share,
      path: '/pages/index/index?user=' + APP.globalData.openid,
      imageUrl: APP.urlimg(APP.globalData.setting.wx_sharepic),
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          APP.https('/gamevideoinfo/sharegamevideo', {
            game_id: this.game_id,
            openid: APP.globalData.openid
          }, res => {
            if (res.status == 2000) {
              this.setData({
                //alertdialog: false,
                //cardstate: true
              })
            }
          })
        }
      }
    }
  }
});
function echo(o) {
  console.log(o);
}
function getVideo(name) {
  let video = this.CONFIG[name].video;
  let h265 = video.h265 == "1" ? "h265/" : "";
  //判断手机型号，如果ios系统型号是10以下，需要走h264视频资源
  if ((parseInt(system) < 10 && model.indexOf('iPhone 6s Plus') != -1) || model.indexOf('iPhone 5s') != -1) h265 = '';
  else if (parseInt(system) == 10 && model.indexOf('iPhone 6') != -1) h265 = '';
  else if (local) h265 = '';

  let src = `https://vgame-cdn.edisonluorui.com/upload/${ID}/${h265}${video.video}?t=${version}`;
  return src;
}
function getPoster(name) {
  let video = this.CONFIG[name].video;
  let src = `https://vgame-cdn.edisonluorui.com/upload/${ID}/${video.pic}?t=${version}`;
  return src;
}
function getOption(name) {
  let src = `https://vgame-cdn.edisonluorui.com/upload/${ID}/options/${name}?t=${version}`;
  return src;
}