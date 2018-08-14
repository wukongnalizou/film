const APP = getApp();
var ID = '';
var system = '';
var model = '';
var counttip = 0;
var version = '';
var local = false;
var iswebsocket = false;
var timer = null;
Page({
  data: {
    count: 0,
    concern: false,
    ending: "",
    score: 0,
    videos: [],
    loader: [],
    hide: [],
    action: [],
    options: [],
    showOption: false,
    duration: '',
    rightbottom: true,
    rotate: '', //横竖屏
    endanalyse: 1, //1显示视频 2显示计算结果 3返回页 
    sharetip: false,
    isvideostart: false,
    videoImage: '',
    isvideoimage: true,
    pis: '',
    optionNum: 'zero',
    isRe_on: false,
    durationurl: "",
    qtemote: false
  },
  max: 0, //  选项长度
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
  CONFIG: {}, //步骤
  game_id: '', //gameid
  titleName: '', //title
  user: '', //用户
  openid: '',
  issharetip: true,
  ontime: true,
  onLoad: function(option) {
    var that = this;
    let parem = option;
    this.game_id = ID = parem.id;
    APP.globalData.page = {
      page: "video",
      game_id: this.game_id
    };
    if (parem.user) {
      APP.login(res => {
        this.openid = res.openid;
        this.titleName = parem.name;
        this.user = parem.user;
        //当用户从开始玩跳转过来，变成真
        // iswebsocket = true;
        this.getSysInfo();
      });
    } else {
      this.getSysInfo();
    }
    wx.setNavigationBarTitle({
      title: option.name
    });
    //清除所有用户的缓存,需要后台配合，把字段startgame全部变成1
    /*if ( !wx.getStorageSync('clearAllStorage_v1') ){
          wx.setStorageSync('clearAllStorage_v1', 'success_v1');
          wx.removeStorageSync('name_ckhnZVJUbkZlRDJ4SC9TZXNpeFFvUT09');
          wx.removeStorageSync('playingName_ckhnZVJUbkZlRDJ4SC9TZXNpeFFvUT09');
          wx.removeStorageSync('name_LzJTcHNuUTFEeTU2R3h3TVA5cnRvUT09');
          wx.removeStorageSync('playingName_LzJTcHNuUTFEeTU2R3h3TVA5cnRvUT09');
          wx.removeStorageSync('userScore_LzJTcHNuUTFEeTU2R3h3TVA5cnRvUT09');
    }*/

  },
  getSysInfo() {
    wx.getSystemInfo({
      success: res => {
        if (res.platform == "devtools") local = true;
        if ((res.windowWidth / res.windowHeight) <= 0.59) this.setData({
          pis: "iphoneX"
        });
        system = res.system.slice(4, 6);
        model = res.model;
        this.acceptright();
      }
    });
  },
  // 判断是否是分享进入
  acceptright() {
    if (this.user && this.openid) APP.https('/matelist/friendship', {
      sender: APP.globalData.openid,
      openid: this.user
    }, res => {
      this.user = '';
      this.userplaygamevideo();
    })
    else this.userplaygamevideo();
  },
  userplaygamevideo() {
    APP.https('/gamevideoinfo/userplaygamevideo', {
      openid: APP.globalData.openid,
      game_id: this.game_id
    }, res => {
      if (res.status == '2000') {
        this.jiekou(res);
      }
    })
  },
  // 获取数据接口
  jiekou(res) {
    console.log(system)
    // 版本号
    version = res.data.version;
    // 步骤
    let data = res.data.setting;
    // 横竖屏
    let orientation = res.data.orientation;
    // 新手
    let newhand = res.data.newhand;
    // 本地存储
    wx.setStorageSync('newhand', res.data.newhand);
    this.setData({
      rotate: res.data.orientation
    });
    this.CONFIG = data;
    for (let key in this.CONFIG) {
      let config = this.CONFIG[key];
      // 结束时  无默认值时 图片 跳出循环
      if (config.ending || config.gotoPrev || key == "optionImage") continue;
      // 选项的长度
      // if()
      if (config.choose) {
        let len = config.choose.option.length;
        if (len > this.max) this.max = len;
      }

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
    let startgame = res.data.startgame;
    if (startgame == 1) {} else if (startgame == 2) {
      this.setData({
        isRe_on: true
      })
    }
    this.play(0)
  },
  play: function(x) {
    console.log(x);
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
        } else {
          //禁用
          this.data.loader[i] = {
            src: "",
            poster: "",
            name: ""
          };
          this.data.hide[i] = true;
        }
      }
    } else if (config.gotoPrev) {
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
        } else {
          //其他
          this.data.hide[i] = true;
        }
      }
    } else {
      this.playing = (this.playing + x + 1) % this.max;
      this.data.loader = [];
      if (config.choose) {
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
            this.setData({
              videoImage: getPoster.call(this, this.name)
            });
            this.data.hide[i] = false;
            if (this.data.rotate == 'landscape') {
              for (let i = 0; i < config.choose.option.length; i++) {
                config.choose.option[i].image = getOption(this.CONFIG.optionImage[this.name][i]);
              }
            }
            this.setData({
              options: config.choose.option
            });
          } else if (
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
          } else {
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
    this.setData({
      rightbottom: false
    });

    /*if (this.ontime && this.data.isRe_on) {
      this.video[this.playing].pause();
      this.ontime = false;
    }*/

    //需要在这个位置添加动态实时缓存，为了防止用户从意外渠道退出
    //存在一个问题，如果需要计分，积分是在用户选择的函数里，此处是空对象，少一次计分,计分放在用户选择里
    wx.setStorageSync('name_' + ID, this.name);
    wx.setStorageSync('playingName_' + ID, this.playingName);
  },
  ended: function(e) {
    let i = e.currentTarget.dataset.i;
    if (this.onended[i]) return;
    this.onended[i] = true;
    let config = this.CONFIG[this.name];
    if (config.ending) {
      counttip = 0;
      this.issharetip = true;
      this.setData({
        endanalyse: 2
      });
      let score = 0;
      let ending = config.ending;
      let endScore = ending;
      if (ending == "ending") {
        for (let i in this.userScore) {
          score += parseInt(this.userScore[i].score);
        }
        endScore = score;
      }
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
          var that = this
          var count = 0;
          if (this.data.rotate != 'landscape') {
            var timer = setInterval(function(e) {
              count++;
              that.setData({
                count: count
              });
              if (count == 100) clearInterval(timer);
            }, 40);
          } else {
            var timer = setInterval(function(e) {
              count++;
              that.setData({
                count: count
              });
              if (count == 100) clearInterval(timer);
            }, 40);
          }
          setTimeout(() => {
            this.setData({
              endanalyse: 3
            });
            wx.navigateTo({
              url: '../canpersonresult/canpersonresult?id=' + this.game_id + '&name=' + this.titleName
            })
          }, 4000);
        }
      });
    } else if (config.gotoPrev) {
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
    } else {
      if (config.choose) {
        if (config.choose.duration >= 0 || this.userChoosed != -1) {
          let choosed = this.userChoosed == -1 ? parseInt(config.choose.def) : this.userChoosed;
          this.name = config.choose.option[choosed].next;
          if (config.choose.duration >= 0 || this.userChoosed == config.choose.def) this.playingName = config.choose.option[choosed].next;
          this.setData({
            showOption: false
          });
          this.play(choosed);
        } else {
          this.paused = true;
          //如果暂停则暂停
          this.video[this.nowPlay].pause();
          this.setData({
            isvideoimage: false
          });
        }


      }

    }
  },
  onplaying: function(e) {
    let i = e.currentTarget.dataset.i;
    this.paused = false;
    if (i != this.nowPlay) this.video[i].pause();
  },
  on_play: function() {
    this.video[this.playing].play();
    this.setData({
      isRe_on: false
    })
  },
  re_play: function() {
    this.name = 'start';
    this.playingName = 'start';
    wx.removeStorageSync('name_' + ID);
    wx.removeStorageSync('playingName_' + ID);
    wx.removeStorageSync('userScore_' + ID);
    this.play(0);
    this.setData({
      isRe_on: false
    })
  },
  timeupdate: function(e) {
    // 当前时间
    let currentTime = e.detail.currentTime;
    if (this.ontime && this.data.isRe_on) {
      this.video[this.playing].pause();
      this.ontime = false;
    }
    // 视频持续的时间 
    let duration = e.detail.duration;
    let i = e.currentTarget.dataset.i;
    let name = e.currentTarget.dataset.name;
    if (name != this.name) return;
    let config = this.CONFIG[this.name];
    if (config.ending || config.gotoPrev) {
      if (duration - currentTime <= 2 && !this.onended[i]) this.ended(e);
      return;
    }
    if (config.choose) {
      config.choose.at = parseInt(config.choose.at);
      config.choose.duration = parseInt(config.choose.duration);
      if ((counttip == 3) && (currentTime > (config.choose.at - 3)) && this.issharetip) {
        this.setData({
          sharetip: true
        });
        setTimeout(() => {
          this.setData({
            sharetip: false
          });
        }, 2000);
        this.issharetip = !this.issharetip;
      }

      if (config.choose.duration != 0) {
        if (currentTime >= config.choose.at && this.onchoosing[i] == 0) {
          let optionNum = config.choose.option.length;
          this.setData({
            optionNum: optionNum
          });
          counttip++;
          this.setData({
            showOption: true,
            duration: (config.choose.duration)
          });
          var parseduration = parseInt(config.choose.duration);
          if (parseInt(config.choose.duration) < 6) {
            this.setData({
              durationurl: "../../img/durationurl" + parseInt(config.choose.duration) + ".png"
            })
          }
          //这里需要判断是谁的游戏，双星还是罗哥的，双星视频不需要倒计时,后期需要在这里修改 
          console.log(!config.choose.score);
          if (!config.choose.score) {
            let duration = (config.choose.duration);
            timer = setInterval(() => {
              let middle = duration - 1;
              duration = middle;
              this.setData({
                duration: middle
              })
              if (middle < 6) {
                this.setData({
                  durationurl: "../../img/durationurl" + parseInt(middle) + ".png"
                })
              }
              if (middle == -1 || duration == -1) {
                clearInterval(timer);
                this.setData({
                  showOption: false
                });
              }
            }, 1000);
          }
          this.onchoosing[i] = 1;
        }

        if (config.choose.duration > 0) {
          //bug原因，后台设置的at事件加上duration时间总和过大，导致当前时间与duratiojn差值已经小于2了
          if (currentTime >= (config.choose.at + config.choose.duration) && this.onchoosing[i] == 1) {
            this.onchoosing[i] = 2;
          }
        }
        if (duration - currentTime <= 2 && !this.onended[i]) {
          this.ended(e);
        }
      }
    }
  },
  userChoose: function(e) {
    let i = e.currentTarget.dataset.i;
    let config = this.CONFIG[this.name];
    this.userChoosed = parseInt(i);
    if (config.choose.duration && config.choose.duration == -1) {
      let userScore = this.userScore[this.name] || {
        times: 0,
        score: 0
      };
      if (config.choose.score) {
        if (this.userChoosed == config.choose.def) userScore.score = config.choose.score[userScore.times] || 0;
        else userScore.times++;
        this.userScore[this.name] = userScore;
        //需要在这里计分，用户选择了就立刻计分
        wx.setStorageSync('userScore_' + ID, this.userScore);
      }

    }
    this.setData({
      showOption: false
    });
    this.onchoosing[this.nowPlay] = 2;
    if (this.paused) {
      let config = this.CONFIG[this.name];
      console.log(config.choose.option[this.userChoosed].next);
      this.name = config.choose.option[this.userChoosed].next;
      this.onchoosing[this.nowPlay] = 0;
      if (!config.choose.score || (config.choose.score && this.userChoosed == config.choose.def)) this.playingName = config.choose.option[this.userChoosed].next;
      this.play(this.userChoosed);
    }
  },
  controls: function() {
    if (this.onchoosing[this.nowPlay] == 1 || this.onended[this.nowPlay]) return;
    //当第二次播放，弹出选项时，有1秒的播放期间用于给用户提供剧情印象，此时用户点击暂停，是不允许的
    if (this.data.isRe_on) return;
    if (this.paused) {
      this.video[this.nowPlay].play();
      this.setData({
        isvideostart: false
      });
    } else {
      this.video[this.nowPlay].pause();
      this.setData({
        isvideostart: true
      });
    }
    this.paused = !this.paused;
  },
  gobackindex() {
    wx.switchTab({
      url: '../index/index',
      success: function() {
        //可以用来修改是否保存的状态
      }
    })
  },
  closeconcern() {
    this.setData({
      concern: false
    })
  },
  onHide: function() {
    // iswebsocket = false;
    wx.setStorageSync('name_' + ID, this.name);
    wx.setStorageSync('playingName_' + ID, this.playingName);
    wx.setStorageSync('userScore_' + ID, this.userScore);

  },
  onShow: function() {
    this.name = wx.getStorageSync('name_' + ID) || 'start';
    this.playingName = wx.getStorageSync('playingName_' + ID) || 'start';
    this.userScore = wx.getStorageSync('userScore_' + ID) || {};

    // if (!iswebsocket) {

    //   function checksuccess() {
    //     setTimeout(() => {
    //       if (APP.globalData.relogin) {
    //         APP.socketReconnect()
    //       } else {
    //         checksuccess.call(this)
    //       }
    //     }, 500);
    //   }
    //   checksuccess.call(this);

    // }

  },
  onUnload: function() {
    //需要判断是谁下的游戏，罗哥下的视频是不需要计分的
    let config = this.CONFIG[this.name];
    if (config.choose.score) {
      wx.setStorageSync('userScore_' + ID, this.userScore);
    }
    wx.setStorageSync('name_' + ID, this.name);
    wx.setStorageSync('playingName_' + ID, this.playingName);

    APP.globalData.page = {};
    APP.https('/subscribe/disconnect', {
      open_id: APP.globalData.openid
    }, res => {
      if (res.status == '2000') {}
    });
  },
  onShareAppMessage: function() {
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
  },
});

function getVideo(name) {
  let video = this.CONFIG[name].video;
  let h265 = video.h265 == "1" ? "h265/" : "";
  //判断手机型号，如果ios系统型号是10以下，需要走h264视频资源
  if ((parseInt(system) < 10 && model.indexOf('iPhone') != -1)) h265 = '';
  else if (parseInt(system) == 10 && model.indexOf('iPhone') != -1) h265 = '';
  else if (parseInt(system) < 11 && parseInt(system) > 10 && model.indexOf('iPhone') != -1) h265 = '';
  else if (local) h265 = '';

  let src = `https://vgame-cdn.edisonluorui.com/upload/${ID}/${h265}${video.video}?t=${version}`;
  return src;
}

function getPoster(name) {
  let video = this.CONFIG[name].video;
  let src = `https://vgame-cdn-image.edisonluorui.com/upload/${ID}/${video.pic}?t=${version}`;
  return src;
}

function getOption(name) {
  let src = `https://vgame-cdn-image.edisonluorui.com/upload/${ID}/options/${name}?t=${version}`;
  return src;
}