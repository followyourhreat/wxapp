// pages/equipment/equipmentList/equipmentList.js
import api from '../../../api/api'
import {
  urlObj
} from '../../../api/url'
var app = getApp()

const watch = require("../../../utils/watch.js");
var color = "#C81D01"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 电暖气状态
    flag: false,
    device_mac: '',
    // checkState: app.globalData.equipmentState.open,
    checkState: '',
    weatherIcon: '../../../images/bg_weather_sun.png',
    stateIcon: '../../../images/control_icon_hide.png',
    addIcon1: "../../../images/but_reducecopy@3x.png",
    addIcon2: "../../../images/Artboard21.png",
    jianIcon: "../../../images/but_reduce@3x.png",
    jianIcon2: "../../../images/but_reduce@3xs.png",
    setting: '../../../images/control_icon_Setting.png',
    setting_icon: '../../../images/setting_icon.png',
    //童锁开关
    // bhSet: app.globalData.equipmentState.hdSwich,
    bhSet: '',
    //背光
    // dinkSet: app.globalData.equipmentState.light,
    dinkSet: '',
    equipmentData: {
      c: '暂无数据',
      city: '暂无数据',
      state: '暂无状态',
      temperature: '-'
    },
    weather: {
      location: '116.39602661,39.89314331',
      type: '2'
    },
    visible1: false,
    hengwen:'',
    actions1: [{
        name: '自动挡',
        color: color
      },
      {
        name: '一挡',
        color: ""
      },
      {
        name: '二挡',
        color: ""
      },
      {
        name: '三挡',
        color: ""
      },
    ],
    //恒温模式
    mode: '',
    minValue: 6,
    maxValue: 36,
    nowValue: 26,
    discheck: true,
    timingicon: {
      icon1: "../../../images/control_but_timing.png",
      icon2: "../../../images/home_equipment_but_on.png"
    },
    gearicon: {
      icon1: "../../../images/control_but_Gearposition.png",
    },
    bhiconShow: '../../../images/control_but_lock.png',
    bhiconShow1: "../../../images/control_but_lock.png",
    bhiconShow2: "../../../images/tongsuo_1.png",
    dicon: '../../../images/control_but_lock_off.png',
    dicon1: "../../../images/control_but_lock_off.png",
    dicon2: "../../../images/beiguang2.png",

    // openIcon: "../../../images/home_equipment_but_on.png",
    openIcon: "../../../images/close2.png",
    // openIcon2: "../../../images/close2.png",
    swithicon: {
      icon1: "../../../images/home_equipment_but_on.png",
      icon2: "../../../images/close2.png"
    },
    // heating: app.globalData.equipmentState.heating
    heating: '',
    dataId: '',
    device_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this
    // watch.setWatcher(this); // 设置监听器，建议在onLoad下调用
    that.setData({
      device_mac: options.mac,
      dataId: options.id,
      device_id: options.device_id
    })
    this.init()
    this.timeSignal()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  init() {
    wx.showToast({
      icon: 'loading',
      title: '加载数据中',
      mask: true,
      duration: 3000
    })
    let storage_equipmentData = wx.getStorageSync('equipmentData')
    // console.log(storage_equipmentData)
    let equipmentData = Object.assign({}, this.data.equipmentData)
    equipmentData.city = storage_equipmentData.city,
      equipmentData.c = storage_equipmentData.temperature,
      equipmentData.weather_img = storage_equipmentData.weather_img
    this.setData({
      equipmentData
    })

    this.searchMess()
    // app.globalData.mqtt.subscribe("dt2014/app/" + this.data.device_mac);
    // api.post(urlObj.push_msg, {
    //   device_mac: this.data.device_mac,
    //   code: '3001'
    // }).then(r => {})
  },
  lineOff() {
    var that = this
    app.globalData.mqtt.onConnectionLost = function(responseObject) {
      // console.log("onConnectionLost:" + responseObject.errorMessage);
      wx.showToast({
        title: '设备连接已断开',
        icon: 'none',
        duration: 1500
      });
      that.setData({
        flag: false
      })
      // wx.switchTab({
      //   url: '../equipmentList/equipmentList'
      // })
    }

    app.globalData.mqtt.onConnected = function(responseObject) {
      console.log("onConnected:" + responseObject);
      // console.log(22222)
      wx.showToast({
        title: '设备已连接',
        icon: 'success',
        duration: 1500
      });
      that.setData({
        flag: true
      })
      that.searchMess()

    }
  },
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示 
   */
  onShow: function() {
    // this.init()
    this.searchMess()
    this.get_message()
    this.lineOff()
  },
  // 授时
  timeSignal() {
    let newDate = new Date();
    let hours = newDate.getHours(); //获取系统时，
    let minues = newDate.getMinutes(); //分
    let seconds = newDate.getSeconds(); //秒
    let week = newDate.getDay() == 0 ? 7 : newDate.getDay(); //星期
    let arr = [hours, minues, seconds, week]
    // console.log(arr)
    let newArr = arr.map(x => {
      let v = x.toString(16)
      if (v.length < 2) {
        v = '0' + v
      }
      return v
    })
    // console.log(newArr.join(''))
    api.post(urlObj.push_msg, {
      device_mac: this.data.device_mac,
      code: '3007',
      msg: newArr.join('')
    }).then(r => {
      if (r.errcode == 0) {}
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  //加减温度

  addValue() {
    if (this.data.bhSet || this.data.checkState == false) {
      return
    }
    let nowValue = this.data.nowValue
    nowValue++
    if (nowValue > this.data.maxValue) {
      nowValue = this.data.minValue
    }
    this.setData({
      nowValue,
      discheck: false
    })
    // console.log(this.data.nowValue)
    this.settingWendu()
  },

  jianValue() {
    if (this.data.bhSet || this.data.checkState == false) {
      return
    }
    let nowValue = this.data.nowValue
    nowValue--
    if (nowValue < this.data.minValue) {
      nowValue = this.data.maxValue
    }
    this.setData({
      nowValue,
      discheck: false
    })

    this.settingWendu()

  },
  //设置
  goSetting() {
    if (this.data.bhSet || this.data.checkState == false) {
      return
    }
    let mac = this.data.device_mac
    let dataId = this.data.dataId
    let device_id = this.data.device_id
    wx.navigateTo({
      url: '../setting/index/index?mac=' + mac + '&id=' + dataId + '&device_id=' + device_id
    })
  },
  //定时模式
  gotimingPage() {
    if (this.data.bhSet) {
      return
    }
    let mac = this.data.device_mac
    wx.navigateTo({
      url: '../timerMode/timerMode?mac=' + mac
    })
  },

  //切换模式
  changeMode(e) {
    if (this.data.bhSet == true || this.data.checkState == false) {
      return false
    }
    // console.log(e)
    let {
      mode
    } = e.currentTarget.dataset
    // console.log(this.data.nowValue)
    if (mode == "1" && this.data.mode == false) {

      //恒温模式
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3004',
        msg: '01'
      }).then(r => {
        if (r.errcode == 0){
          this.setData({
            minValue: 6,
            maxValue: 36,
            nowValue:0
            // nowValue: this.data.hengwen,
            
            // mode: true
          })

          wx.showToast({
            title: '恒温模式',
            icon: 'success',
            duration: 2000
          });
        }

      })
      // this.settingWendu()
  
    } else if (mode == "2" && this.data.mode == true) {

      //睡眠模式
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3004',
        msg: '02'
      }).then(r => {
        if (r.errcode == 0) {
          this.setData({
            minValue: 10,
            maxValue: 26,
            nowValue: 0
            
            // nowValue: '26',
            // mode: false

          })
          // this.settingWendu()
          wx.showToast({
            title: '睡眠模式',
            icon: 'success',
            duration: 2000
          });
        }

      })

    }
    // this.setData({
    //   mode: !this.data.mode
    // })
  },
  bindchanging(e) {
    // this.setData({
    //   nowValue: e.detail.value
    // })
    // this.settingWendu()
  },
  slider4change(e) {
    this.setData({
      nowValue: e.detail.value
    })
    this.settingWendu()

  },

  // 档位切换
  gogearPage() {
    //禁用
    return false
    if (this.data.bhSet) {
      return
    }
    this.setData({
      visible1: true
    })
  },

  handleCancel1() {
    this.setData({
      visible1: false
    });
  },
  handleClickItem1({
    detail
  }) {
    const index = detail.index + 1;
    let idx = index - 1
    let actions1 = this.data.actions1

    actions1.map((x, i) => {
      if (idx == i) {
        x.color = color
      } else {
        x.color = ""
      }
    })
    this.setData({
      visible1: false,
      actions1
    })
  },
  //童锁
  gobhPage() {
    if (!this.data.flag || this.data.checkState == false) {
      return
    }
    this.setData({
      bhSet: !this.data.bhSet
    })
    if (this.data.bhSet) {
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3005',
        msg: '01'
      }).then(r => {
        if (r.errcode == 0) {
          wx.showToast({
            title: '已锁定',
            icon: 'success',
            duration: 2000
          });
        }
      })
    } else {
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3005',
        msg: '02'
      }).then(r => {
        if (r.errcode == 0) {
          wx.showToast({
            title: '已解锁',
            icon: 'success',
            duration: 2000
          });
        }
      })
    }
  },

  // 设备开启开关
  openHandler() {
    if (this.data.bhSet) {
      return
    }
    if (!this.data.flag) {
      wx.showToast({
        title: '设备不在线或断开连接',
        icon: 'none',
        duration: 2000
      });
      return
    }
    let nowcheckState = this.data.checkState
    nowcheckState = !nowcheckState

    // this.setData({
    //   checkState: !this.data.checkState
    // })
    // // console.log(this.data.device_mac)
    // if (this.data.checkState) {
    if (nowcheckState) {
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3006',
        msg: '01'
      }).then(r => {}).catch((err) => {
        // console.log(err)
        if (err.errcode === 400010) {
          wx.showToast({
            icon: 'none',
            title: '设备不在线',
            duration: 1500
          })
          this.setData({
            flag: false,
            checkState: false
          })
        }
      })
    } else {
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3006',
        msg: '02'
      }).then(r => {}).catch((err) => {
        // console.log(err)
        if (err.errcode === 400010) {
          wx.showToast({
            icon: 'none',
            title: '设备不在线',
            duration: 1500
          })
          this.setData({
            flag: false,
            checkState: false,
            openIcon: this.data.swithicon.icon2
          })
        }
      })
    }
  },
  //背光控制
  godinkPage() {
    if (this.data.bhSet == true || this.data.checkState == false) {
      return
    }
    this.setData({
      dinkSet: !this.data.dinkSet
    })
    // console.log(this.data.dinkSet)
    if (this.data.dinkSet == false) {
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3009',
        msg: '02'
      }).then(r => {
        if (r.errcode == 0) {
          wx.showToast({
            title: '关闭背光',
            icon: 'success',
            duration: 2000
          });
        }
      })

    } else if (this.data.dinkSet == true) {
      api.post(urlObj.push_msg, {
        device_mac: this.data.device_mac,
        code: '3009',
        msg: '01'
      }).then(r => {
        if (r.errcode == 0) {
          wx.showToast({
            title: '开启背光',
            icon: 'success',
            duration: 2000
          });
        }
      })

    }
  },
  // 设置温度函数
  settingWendu() {
    if (this.data.checkState == false || this.data.bhSet == true) {
      return
    }
    let value = this.data.nowValue.toString(16)
    if (value.length < 2) {
      value = '0' + value
    } else {
      value = value
    }
    api.post(urlObj.push_msg, {
      device_mac: this.data.device_mac,
      code: '3002',
      msg: value
    }).then(r => {
      if (r.errcode == 0) {
        this.setData({
          discheck: true
        })
      }
    })
  },
  // 查询设备
  searchMess() {
    app.globalData.mqtt.subscribe("dt2014/app/" + this.data.device_mac);
    api.post(urlObj.push_msg, {
      device_mac: this.data.device_mac,
      code: '3001'
    }).then(r => {
      if (e.errcode === 0) {

        this.setData({
          flag: true
        })
      }
    }).catch((e) => {
      if (e.errcode === 400010) {
        wx.showToast({
          icon: 'none',
          title: '设备不在线',
          duration: 1500
        })
        this.setData({
          flag: false
        })
      }
    })
  },
  // 消息上报
  get_message() {
    var that = this
    app.globalData.mqtt.onMessageArrived = function(message) {
      // console.log(message)
      // if (message) {
      //   that.setData({
      //     flag: true
      //   })
      // } else {
      //   that.setData({
      //     flag: false
      //   })
      // }
      // console.log(message.destinationName)
      // let message_mac = message.destinationName.slice(11)
      // console.log(message_mac)
      // 判断主题是否一致
      console.log(`当前设备 ${that.data.device_mac} 上报设备 ${message.destinationName.slice(11)}`, message.destinationName.slice(11) == that.data.device_mac)
      if (message.destinationName.slice(11) != that.data.device_mac) {
        return
      }
      var arr = []
      message.payloadBytes.map(r => {
        // console.log(r.toString(16))
        let v = r.toString(16)
        if (v.length < 2) {
          v = '0' + v
        }
        arr.push(v)
      })
      console.log(`设备详情 ${arr}`);
      if(arr.length == 37){
        console.log(`mac:${arr[2]}${arr[3]}${arr[4]}${arr[5]}${arr[6]}${arr[7]} 温度:${arr[18]}${arr[19]} ${arr[20]=='01'?'周一至周五':'周末'}时间:${arr[22]}:${arr[23]}-${arr[24]}:${arr[25]} 开关状态:${arr[21]=='01'?'开':'关'} 接收时间: ${new Date()}`);
      }else{
        console.log(`mac:${arr[2]}${arr[3]}${arr[4]}${arr[5]}${arr[6]}${arr[7]} 温度:---- ${arr[17]=='01'?'周一至周五':'周末'}时间:${arr[19]}:${arr[20]}-${arr[21]}:${arr[22]} 开关状态:${arr[18]=='01'?'开':'关'} 接收时间: ${new Date()}`);
      }
      // 设备状态消息包

      // 离线在线状态
      var len = arr.length
      if (arr[0] == '6b') {
        if (arr[len - 1] == 30) {
          // console.log('离线了')
          wx.showToast({
            icon: 'none',
            title: '设备不在线',
            duration: 1500
          })
          //离线
          that.setData({
            flag: false
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '../equipmentList/equipmentList'
            })
          },1500)
        } else if (arr[len - 1] == 31) {
          //在线
          // console.log('在线了')
          // 查询  
          that.searchMess()
          that.setData({
            flag: true
          })

        }
      }
      if (message.payloadBytes[15] == 0x38){
        that.setData({
          flag: true
        })
      }
      if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x01) {
        
        //         //设备状态
        //         // 1.设备开关
        if (message.payloadBytes[33] == 0x01) {

          // app.globalData.equipmentState.open = true
          that.setData({
            checkState: true,
            openIcon: that.data.swithicon.icon1
          })
        } else if (message.payloadBytes[33] == 0x02) {

          // app.globalData.equipmentState.open = false
          that.setData({
            checkState: false,
            openIcon: that.data.swithicon.icon2
          })
        }
        // 2.模式切换
        if (message.payloadBytes[32] == 0x01) {
          

          // app.globalData.equipmentState.mode = true
          that.setData({
            mode: true,
            minValue: 6,
            maxValue: 36,
            // nowValue: '36',
            hengwen: parseInt(arr[17], 16)
          })
        } else if (message.payloadBytes[32] == 0x02) {

          // app.globalData.equipmentState.mode = false
          that.setData({
            mode: false,
            minValue: 10,
            maxValue: 26,
            // nowValue: '26',
          })
        }

        //3.童锁模式
        if (message.payloadBytes[31] == 0x01) {

          // app.globalData.equipmentState.hdSwich = true
          that.setData({
            bhSet: true,
            bhiconShow: that.data.bhiconShow2
          })
        } else if (message.payloadBytes[31] == 0x02) {

          // app.globalData.equipmentState.hdSwich = false
          that.setData({
            bhSet: false,
            bhiconShow: that.data.bhiconShow1
          })
        }

        //4.背光
        if (message.payloadBytes[30] == 0x01) {
          that.setData({
            dinkSet: true,
            dicon: that.data.dicon2

          })
        } else if (message.payloadBytes[30] == 0x02) {
          that.setData({
            dinkSet: false,
            dicon: that.data.dicon1
          })
        }

        //5.加热状态
        if (message.payloadBytes[34] == 0x01) {
          // app.globalData.equipmentState.heating = true
          that.setData({
            heating: true,
          })
        } else if (message.payloadBytes[34] == 0x02) {
          // app.globalData.equipmentState.heating = false
          that.setData({
            heating: false,
          })
        }

        //5.当前温度
        let wen = `0x${arr[18]}${arr[19]}`
        console.log(wen)
        if (wen > 0x8000) {
          let fuNum = wen - '0x8000'
          that.setData({
            'equipmentData.temperature': '-' + fuNum / 10
          })
        }else{
          let nowWendu = parseInt(`${arr[18]}${arr[19]}`, 16)

          that.setData({
            'equipmentData.temperature': nowWendu / 10
          })
        }     

        let setWendu = message.payloadBytes[17]

        // that.setData({
        //   nowValue: setWendu
        // })

        //6.设置的温度      
        if (that.data.discheck) {
          that.setData({
            nowValue: parseInt(arr[17], 16)
          })
        }
      }

      // 单例功能上报消息

      //是否背光
      else if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x09) {
        if (message.payloadBytes[17] == 0x01) {
          that.setData({
            dinkSet: true,
            dicon: that.data.dicon2
          })
        } else if (message.payloadBytes[17] == 0x02) {
          that.setData({
            dinkSet: false,
            dicon: that.data.dicon1

          })
        }
      }

      //童锁状态上报
      else if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x05) {
        if (message.payloadBytes[17] == 0x01) {
          that.setData({
            bhSet: true,
            bhiconShow: that.data.bhiconShow2
          })
        } else if (message.payloadBytes[17] == 0x02) {
          that.setData({
            bhSet: false,
            bhiconShow: that.data.bhiconShow1
          })
        }
      }

      // 上报功能模式
      else if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x04) {
        // console.log('模式')

        // 2.模式切换
        if (message.payloadBytes[17] == 0x01) {

          // app.globalData.equipmentState.mode = true
          that.setData({
            mode: true,
            minValue: 6,
            maxValue: 36,
            // nowValue: '36',
          })

        } else if (message.payloadBytes[17] == 0x02) {
          // app.globalData.equipmentState.mode = false
          that.setData({
            mode: false,
            minValue: 10,
            maxValue: 26,
            // nowValue: '26',
          })
        }
      }

      // 设置的温度上报
      else if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x02) {
        if (that.data.discheck) {
          that.setData({
            nowValue: parseInt(arr[17], 16),
            // hengwen: parseInt(arr[17], 16)
          })
        }
      }

    }
  },
})