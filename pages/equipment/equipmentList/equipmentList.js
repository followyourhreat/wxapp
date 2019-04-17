var app = getApp()
import api from '../../../api/api'
import {
  urlObj
} from '../../../api/url'
const watch = require("../../../utils/watch.js");
var open = app.globalData.equipmentState.open
var device_mac = app.globalData.device_mac
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    height: 0,
    scrollY: true,
    hiddenmodalput: true,
    // dataArray: [{
    //   name: '取暖器设备1',
    //   state: '',
    //   temperature: "22℃",
    //   switch: 0
    // }
    //  ],
    rename: '',
    weather: {
      location: '116.39602661,39.89314331',
      type: '2'
    },
    renameParams: {},
    dataArray: [],
    offLine:'../../../images/lixian.png',
    stateIcon: '../../../images/equipment_label_heating.png',
    stateIcon2: '../../../images/equipment_label_Standby.png',
    lastSlideSender: null,
    // imgUrls: [
    //   'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    // ],
    bannerList:[
      '../../../images/banner_1.jpg',
      // '../../../images/banner_2.jpg',
      '../../../images/banner_3.jpg',
      '../../../images/banner_4.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    equipmentData: {},
    flag: true,
    code: '',
    unionid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function() {
    wx.login({
      success: res => {
        wx.showLoading({
          title: '正在登陆...',
        })
        this.setData({
          code: res.code
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.getOpenId()
      },
      fail: e => {
      }
    })
    // this.init()
    this.getWeate()
  },

  // 获取unionid
  getOpenId() {
    var that = this
    let code = that.data.code
    api.post(urlObj.push_code, {
      code: code
    }).then((r) => {
      if (r.errcode == 0) {
        wx.setStorageSync('openid', r.data.openid)
        app.globalData.openid = r.data.openid
        let unionid = r.data.unionid
        that.setData({
          unionid
        })
        that.login()
      }
    })
  },
  // //第三方登录
  login() {
    var that = this
    api.post(urlObj.login, {
      openid: this.data.unionid,
      type: 2
    }).then((r) => {
      if (r.errcode == 0) {
        wx.hideLoading()
        wx.setStorageSync("loginInfo", r.data)
        that.init()
      }
    })
  },

  lineOff() {
    var that = this
    app.globalData.mqtt.onConnectionLost = function(responseObject) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
      // wx.showToast({
      //   title: '设备连接已断开',
      //   icon: 'none',
      //   duration: 1500
      // });
      // that.setData({
      //   flag: false
      // })
    }

    app.globalData.mqtt.onConnected = function(responseObject) {
      // console.log("onConnected:" + responseObject);
      // wx.showToast({
      //   title: '设备已连接',
      //   icon: 'success',
      //   duration: 1500
      // });  
      if (that.data.dataArray.length > 0) {      
        that.searchMess()             
      }
    }
  },
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.init()
    this.searchMess()
    this.get_message()
    this.lineOff()
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
  onPullDownRefresh: function() {
    this.init()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  getWeate() {
    let that = this
    wx.getLocation({
      success(res) {

        let location = res.longitude + "," + res.latitude
        that.setData({
          'weather.location': location
        })
        api.post(urlObj.getweather, that.data.weather).then((res) => {

          if (res.errcode == 0) {
            wx.setStorageSync('equipmentData', res.data)

          }
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},


  init() {
    wx.showToast({
      icon: 'loading',
      title: '加载数据中',
      mask: true,
      duration: 3000
    })

    var that = this
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      type: '0'
    }
    // 获取消息状态
    api.post(urlObj.get_message, params).then((res) => {
      if(res.data.remind){
        wx.showTabBarRedDot({index: 0})
      }
    })

    // wx.showNavigationBarLoading(); //在标题栏中显示加载
    api.post(urlObj.get_user_device, params).then((res) => {
      // wx.hideNavigationBarLoading(); //在标题栏中显示加载 
      if (res.errcode == 0) {
        that.setData({
          dataArray: res.data,
        })
        console.log(app)
        that.data.dataArray.map((r) => {
          app.globalData.mqtt.subscribe("dt2014/app/" + r.mac)
          api.post(urlObj.push_msg, {
            device_mac: r.mac,
            code: '3001'
          }).then(r => {}).catch((e) => {
            // wx.showToast({
            //   icon: 'none',
            //   title: e.errmsg,
            //   duration: 5000
            // })
            // that.setData({
            //   flag: false
            // })
          })
        })
        // app.globalData.device_mac = res.data[0].mac
      }

    }).catch((e) => {

      let err = e.errmsg
      if (e.errcode == 400011) {
        wx.showToast({
          icon: 'none',
          title: '没有数据',
          duration: 5000
        })
        that.setData({
          dataArray: []
        })
      } else if (e.errcode == 400006) {
        wx.redirectTo({
          url: '../../login/login'
        })
      } else {
        // wx.showToast({
        //   icon: 'none',
        //   title: err,
        //   duration: 5000
        // })
      }
    })
  },
  // 查询设备
  searchMess() {
    this.data.dataArray.map((r,i) => {
      // app.globalData.mqtt.subscribe("dt2014/app/" + r.mac)
      api.post(urlObj.push_msg, {
        device_mac: r.mac,
        code: '3001'
      }).then(r => {

       }).catch((e) => {
        if (e.errcode === 400010) {
          // wx.showToast({
          //   icon: 'none',
          //   title: '设备不在线',
          //   duration: 1500
          // })
          var ocheckState = "dataArray[" + i + "].checkState" //这里需要将设置的属性用字符串进行拼接  
          var otemperature = "dataArray[" + i + "].temperature" //这里需要将设置的属性用字符串进行拼接  
          this.setData({
            [ocheckState]:false,
            [otemperature]:''
          })
        }
      })
    })
  },
  // 消息上报
  get_message() {
    var that = this
    app.globalData.mqtt.onMessageArrived = function(message) {
        // that.setData({
        //   flag: true
        // })
        // console.log(message.destinationName)
        let message_mac = message.destinationName.slice(11)
        that.data.dataArray.map((v, i) => {
          if (v.mac == message_mac) {

            var arr = []
            message.payloadBytes.map(r => {

              let x = r.toString(16)
              if (x.length < 2) {
                x = '0' + x
              }
              arr.push(x)
            })
            console.log(`设备列表 ${arr}`);
            if(arr.length == 37){
              console.log(`mac:${arr[2]}${arr[3]}${arr[4]}${arr[5]}${arr[6]}${arr[7]} 温度:${arr[18]}${arr[19]} ${arr[20]=='01'?'周一至周五':'周末'}时间:${arr[22]}:${arr[23]}-${arr[24]}:${arr[25]} 开关状态:${arr[21]=='01'?'开':'关'} 接收时间: ${new Date()}`);
            }else{
              console.log(`mac:${arr[2]}${arr[3]}${arr[4]}${arr[5]}${arr[6]}${arr[7]} 温度:---- ${arr[17]=='01'?'周一至周五':'周末'}时间:${arr[19]}:${arr[20]}-${arr[21]}:${arr[22]} 开关状态:${arr[18]=='01'?'开':'关'} 接收时间: ${new Date()}`);
            }
            
            // 定义设备数据对象的属性
            // var oswitch = "dataArray[" + i + "].switch" //这里需要将设置的属性用字符串进行拼接  
            // 开关
            var ocheckState = "dataArray[" + i + "].checkState" //这里需要将设置的属性用字符串进行拼接  
            // 温度
            var otemperature = "dataArray[" + i + "].temperature" //这里需要将设置的属性用字符串进行拼接  
            // 在线离线状态
            var ostatus = "dataArray[" + i + "].status" //这里需要将设置的属性用字符串进行拼接  
            // 加热与否
            var oheating = "dataArray[" + i + "].heating" //这里需要将设置的属性用字符串进行拼接  
            

            // 离线在线状态
            var len = arr.length
            if (arr[0] == '6b'){
              if(arr[len-1] == 30){
                // console.log('离线了')
                //离线
                that.setData({
                  [ostatus]:'0',
                  [ocheckState]: false                  
                })
              } else if (arr[len - 1] == 31){
                //在线
                // console.log('在线了') 
                // 查询  
                that.searchMess()             
                that.setData({
                  [ostatus]: '1'
                })
              }
            }

            if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x01) {
              that.setData({
                [ostatus]: '1'
              })
              //设备状态
              // 1.设备开关
              if (message.payloadBytes[33] == 0x01) {

                that.setData({
                  [ocheckState]: true
                })

              } else if (message.payloadBytes[33] == 0x02) {
                that.setData({
                  [ocheckState]: false
                })
              }

              //5.加热状态
              if (message.payloadBytes[34] == 0x01) {
                // app.globalData.equipmentState.heating = true
                // console.log('加热中')
                that.setData({
                  [oheating]: true,
                })
              } else if (message.payloadBytes[34] == 0x02) {
                // app.globalData.equipmentState.heating = false
                that.setData({
                  [oheating]: false,
                })
                // console.log('加热关闭')
              }
              // 当前温度
              let wen = `0x${arr[18]}${arr[19]}`
              // let wen = '0x0050'            
              // console.log(wen)
              if (wen > 0x8000){
                let fuNum = wen - '0x8000'
                that.setData({
                  [otemperature]: '-' + fuNum / 10
                })
              }else{
                // console.log(message.payloadBytes[18] + ',' + message.payloadBytes[19])
                let nowWendu = parseInt(`${arr[18]}${arr[19]}`, 16)
                that.setData({
                  [otemperature]: nowWendu / 10
                })
              }
            }
            // 开关数据上报
            if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x06) {
              // 1.设备开关
              if (message.payloadBytes[17] == 0x01) {

                that.setData({
                  [ocheckState]: true
                })

              } else if (message.payloadBytes[17] == 0x02) {
                that.setData({
                  [ocheckState]: false
                })
              }
            }
          }
        })
    }
  },

  /**
   * cell绑定事件,删除触发
   */
  deleteAction: function(e) {
    var that = this
    //拿到角标
    var row = e.detail.row;

    wx.showToast({
      title: '请到微信-设置-设备，进行删除操作',
      icon:'none',
      duration: 4000,
    })

    // let id = e.currentTarget.dataset.row.id
    // let loginInfo = wx.getStorageSync('loginInfo')
    // let params = {
    //   uid: loginInfo.uid,
    //   token: loginInfo.token,
    //   id: id
    // }

    // api.post(urlObj.del_device, params).then((res) => {
    //   if (res.errcode == 0) {
    //     wx.showToast({
    //       icon: 'success',
    //       title: '删除成功',
    //       duration: 1500
    //     })

    //     setTimeout(() => {
    //       that.init()
    //     }, 1500)
    //   }
    // })

    // dataArray.splice(row, 1)
    // this.setData({
    //   dataArray
    // })
  },
  /**
   * cell绑定事件,滑动触发
   */
  slideAction: function(e) {
    //拿到角标
    var row = e.detail.row;
    //获取角标cell
    var slideSender = this.selectComponent("#slideitem-" + row);
    //在data中定义lastSlideSender 属性,用户记录上一个打开的cell
    var lastSlideSender = this.data.lastSlideSender;
    //如果存在已经打开的cell则关闭
    if (lastSlideSender != null && lastSlideSender != slideSender) {
      lastSlideSender.restoreSalid();
    }
    this.setData({
      lastSlideSender: slideSender
    })
  },

  linkToIndex(e) {
    // if (!this.data.flag) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '设备不在线',
    //     duration: 1500
    //   })
    //   return
    // }
    let checkState = e.currentTarget.dataset.row.switch
    let mac = e.currentTarget.dataset.row.mac
    let id = e.currentTarget.dataset.row.id
    let device_id = e.currentTarget.dataset.row.device_id
    app.globalData.device_mac = mac

    api.post(urlObj.push_msg, {
      device_mac: mac,
      code: '3001'
    }).then(r => {
      if (r.errcode === 0){
        wx.navigateTo({
          url: '../index/index?checkState=' + checkState + '&mac=' + mac + '&id=' + id + '&device_id=' + device_id
        })
      }
     }).catch((e) => {
      // wx.showToast({
      //   icon: 'none',
      //   title: e.errmsg,
      //   duration: 5000
      // })
      if (e.errcode === 400010) {
        wx.showToast({
          icon: 'none',
          title: '设备不在线',
          duration: 1500
        })
      }
    })

  },
  // 重命名
  renameEvent: function(e) {

    let id = e.currentTarget.dataset.row.id
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      id: id
    }
    this.setData({
      hiddenmodalput: false,
      renameParams: params,
      rename: ''
    })
  },
  getInput(e) {
    let rename = e.detail.value
    this.setData({
      rename
    })

  },
  modalinput: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function(e) {
    if (this.data.rename == '') {

      wx.showToast({
        title: '设备名称不能为空',
        icon: 'none',
        duration: 1500
      });
      return
    }
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/
    if (reg.test(this.data.rename)) {
      let param = Object.assign({}, this.data.renameParams, {
        name: this.data.rename
      })

      api.post(urlObj.rename, param).then((res) => {

        if (res.errcode == 0) {
          wx.showToast({
            title: '重命名成功',
            icon: 'success',
            duration: 1500
          });
          setTimeout(() => {
            this.init()
          }, 1500)
          this.setData({
            hiddenmodalput: true
          })
        }
      })
    } else {
      wx.showToast({
        title: '设备名称不能存在特殊符号或过长',
        icon: 'none',
        duration: 1500
      });
    }
  },
  switch1Change(e) {

    // if (!this.data.flag) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '设备不在线',
    //     duration: 1500
    //   })
    //   return
    // }
    var id = e.currentTarget.dataset.row.id
    var device_mac = e.currentTarget.dataset.row.mac
    var state = e.detail.value
    var {
      dataArray
    } = this.data

    if (state) {
      api.post(urlObj.push_msg, {
        device_mac: device_mac,
        code: '3006',
        msg: '01'
      }).then(r => {
      }).catch((e) => {

        if (e.errcode === 400010) {
          wx.showToast({
            icon: 'none',
            title: '设备不在线',
            duration: 1500
          })

          dataArray.map((x, i) => {
            if (x.id == id) {
              var ocheckState = "dataArray[" + i + "].checkState" //这里需要将设置的属性用字符串进行拼接  
              this.setData({
                [ocheckState]: false
              })
            }
          })
        }
      })
    } else {
      api.post(urlObj.push_msg, {
        device_mac: device_mac,
        code: '3006',
        msg: '02'
      }).then(r => {}).catch((e) => {

        if (e.errcode === 400010) {
          wx.showToast({
            icon: 'none',
            title: '设备不在线',
            duration: 1500
          })
          dataArray.map((x, i) => {
            if (x.id == id) {
              var ocheckState = "dataArray[" + i + "].checkState" //这里需要将设置的属性用字符串进行拼接  
              this.setData({
                [ocheckState]: false
              })
            }
          })
        }
      })
    }
    this.setData({
      dataArray
    })
  },
  getInfo(e) {
  },

})