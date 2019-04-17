// pages/equipment/timerMode/timerMode.js
import api from '../../../api/api'
import { urlObj } from '../../../api/url'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: 400,
    dataArray: [{
      mode:'1',
      startTime:"00:00",
      endTime:'00:00',
      checked: false,
      weekDate: '周一至周五'
      
    },
    {
      mode: '2',      
      startTime: "00:00",
      endTime: '00:00',
      checked: false,
      weekDate: '周六至周日'
    },
    ],
    device_mac:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          clientHeight: res.windowHeight-46
        })
      }
    })

    // console.log(options)
    this.setData({
      device_mac:options.mac
    })
    // this.init()
  },
  init() {
    wx.showToast({
      icon: 'loading',
      title: '加载数据中',
      mask: true,
      duration: 3000
    })
    app.globalData.mqtt.subscribe("dt2014/app/" + this.data.device_mac);

    api.post(urlObj.push_msg, { device_mac: this.data.device_mac, code: '3001' }).then(r => {
    })
  },
  // 消息上报
  get_message() {
    var that = this
    app.globalData.mqtt.onMessageArrived = function (message) {
        // 判断主题是否一致
        console.log(`当前设备 ${that.data.device_mac} 上报设备 ${message.destinationName.slice(11)}`, message.destinationName.slice(11) == that.data.device_mac)
        if (message.destinationName.slice(11) != that.data.device_mac) {
          return
        }
        var arr = []
        message.payloadBytes.map(r => {
          // console.log(r.toString(16))
          let x = r.toString(16)
          if (x.length < 2) {
            x = '0' + x
          }
          arr.push(x)
        })
        console.log(`设备定时 ${arr}`);
        if(arr.length == 37){
          console.log(`mac:${arr[2]}${arr[3]}${arr[4]}${arr[5]}${arr[6]}${arr[7]} 温度:${arr[18]}${arr[19]} ${arr[20]=='01'?'周一至周五':'周末'}时间:${arr[22]}:${arr[23]}-${arr[24]}:${arr[25]} 开关状态:${arr[21]=='01'?'开':'关'} 接收时间: ${new Date()}`);
        }else{
          console.log(`mac:${arr[2]}${arr[3]}${arr[4]}${arr[5]}${arr[6]}${arr[7]} 温度:---- ${arr[17]=='01'?'周一至周五':'周末'}时间:${arr[19]}:${arr[20]}-${arr[21]}:${arr[22]} 开关状态:${arr[18]=='01'?'开':'关'} 接收时间: ${new Date()}`);
        }

        // 定义设备数据对象的属性
        // var oswitch = "dataArray[" + i + "].switch" //这里需要将设置的属性用字符串进行拼接  
        // var otemperature = "dataArray[" + i + "].temperature" //这里需要将设置的属性用字符串进行拼接  

        if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x01) {
          let times = `${arr[20]}${arr[21]}${arr[22]}${arr[23]}${arr[24]}${arr[25]}`
          // 第几段定时
          let i = arr[20] == "01"? 0 : 1

          let checkIs
          if (arr[21] == "01") {
            checkIs = true
          } else {
            checkIs = false
          }
          
          let checked = "dataArray[" + i + "].checked"
          let startTi = "dataArray[" + i + "].startTime"
          let endTi = "dataArray[" + i + "].endTime"

          that.setData({
            [checked]: checkIs
          })
          let startHours = parseInt(arr[22], 16)
          // console.log(message.payloadBytes[22])
          startHours = startHours < 10 ? `0${startHours}` : startHours
          let startMinues = parseInt(arr[23], 16)
          startMinues = startMinues < 10 ? `0${startMinues}` : startMinues

          let endHours = parseInt(arr[24], 16)
          endHours = endHours < 10 ? `0${endHours}` : endHours
          let endtMinues = parseInt(arr[25], 16)
          endtMinues = endtMinues < 10 ? `0${endtMinues}` : endtMinues
          // 定时开时间
          // let startTime = parseInt(arr[19], 16) + ":" + parseInt(arr[20], 16)
          // let endTime = parseInt(arr[21], 16) + ":" + parseInt(arr[22], 16)

          let startTime = `${startHours}`+':'+`${startMinues}`
          let endTime = `${endHours}`+':'+`${endtMinues}`
          // console.log(startTime)
          // console.log(endTime)

          // 定时开时间
          // let startTime = parseInt(arr[22], 16) + ":" + parseInt(arr[23], 16)
          // let endTime = parseInt(arr[24], 16) + ":" + parseInt(arr[25], 16)
          console.log(startTime,endTime)
          that.setData({
            [startTi]: startTime,
            [endTi]: endTime,
          })
        }

        if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x03){
          let times = `${arr[17]}${arr[18]}${arr[19]}${arr[20]}${arr[21]}${arr[22]}`
          // 第几段定时
          let i = arr[17] == "01" ? 0 : 1

          let checkIs
          if (arr[18] == "01") {
            checkIs = true
          } else {
            checkIs = false
          }

          let checked = "dataArray[" + i + "].checked"
          let startTi = "dataArray[" + i + "].startTime"
          let endTi = "dataArray[" + i + "].endTime"

          that.setData({
            [checked]: checkIs
          })
          let startHours = parseInt(arr[19], 16)
          // console.log(startHours)
          startHours = startHours < 10 ? `0${startHours}` : startHours
          let startMinues = parseInt(arr[20], 16)
          startMinues = startMinues < 10 ? `0${startMinues}` : startMinues

          let endHours = parseInt(arr[21], 16)
          endHours = endHours < 10 ? `0${endHours}` : endHours
          let endtMinues = parseInt(arr[22], 16)
          endtMinues = endtMinues < 10 ? `0${endtMinues}` : endtMinues
          // 定时开时间
          // let startTime = parseInt(arr[19], 16) + ":" + parseInt(arr[20], 16)
          // let endTime = parseInt(arr[21], 16) + ":" + parseInt(arr[22], 16)

          let startTime = `${startHours}` + ':' + `${startMinues}`
          let endTime = `${endHours}` + ':' + `${endtMinues}`
          console.log(startTime,endTime)
          that.setData({
            [startTi]: startTime,
            [endTi]: endTime,
          })
        }
    }
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
    this.init()
    this.get_message()
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
  
  },
  

  selectItme(e){
    // console.log(e)
    let mode = e.currentTarget.dataset.row.mode
    let checked = e.currentTarget.dataset.row.checked
    let mac = this.data.device_mac
    wx.navigateTo({
      url: '../addTimer/addTimer?mode=' + mode + '&checked=' + checked + '&mac=' + mac,
    })
  },

  switch1Change(e){
    wx.showToast({
      icon: 'loading',
      title: '加载数据中',
      mask: true,
      duration: 3000
    })
    let checked = e.detail.value
    // console.log(e)
    let startTime = e.currentTarget.dataset.item.startTime.split(':')
    let endTime = e.currentTarget.dataset.item.endTime.split(':')
    let timearr = startTime.concat(endTime)
    var newarr = timearr.map(v => {
      let x = parseFloat(v).toString(16)
      if (x.length < 2) {
        x = '0' + x
      }
      return x
    })

    // console.log(newarr.join(''))

    if (newarr.join('') == '00000000'){
      setTimeout(()=>{
        wx.showToast({
          icon: 'none',
          title: '设置前定时功能关闭，请设置定时时间',
          duration: 4000
        })
      },1000)

    }
    
    let chenckNum = checked?'01':'02'
    let modeNum = e.currentTarget.dataset.item.mode == '1'? "01":"02"
    
    let params = `${modeNum}${chenckNum}` + newarr.join('')

    api.post(urlObj.push_msg, { device_mac: this.data.device_mac, code: '3003', msg: params}).then(r => {
    })

  },
  
  
})