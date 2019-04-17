// pages/equipment/addTimer/addTimer.js
import api from '../../../api/api'
import { urlObj } from '../../../api/url'
var app = getApp()
var device_mac = app.globalData.device_mac
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeData:{
      hours:'00',
      minute:'00'
    },
    _num: null,
    //开启或关闭
    checked:'',
    mode:'',
    timeData2:{
    hours: '00',
    minute: '00'
  },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let title;
    this.setData({
      mode: options.mode,
      checked: options.checked,
      mac: options.mac
    })
    if (options.mode == '1'){
      title = '周一至周五 定时'
    }else{
      title = '周六至周末 定时'
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init()
    this.get_message()
  },
  init() {
    // app.globalData.mqtt.subscribe("dt2014/app/" + this.data.device_mac);

    api.post(urlObj.push_msg, { device_mac: this.data.mac, code: '3001' }).then(r => {
    })
  },
  // 消息上报
  get_message() {
    var that = this
    app.globalData.mqtt.onMessageArrived = function (message) {
      var arr = []
      message.payloadBytes.map(r => {
        // console.log(r.toString(16))
        let x = r.toString(16)
        if (x.length < 2) {
          x = '0' + x
        }
        arr.push(x)
      })
      // console.log("onMessageArrived2333:" + arr);

      // 定义设备数据对象的属性
      // var oswitch = "dataArray[" + i + "].switch" //这里需要将设置的属性用字符串进行拼接  
      // var otemperature = "dataArray[" + i + "].temperature" //这里需要将设置的属性用字符串进行拼接  

      if (message.payloadBytes[15] == 0x38 && message.payloadBytes[16] == 0x01) {
        let times = `${arr[20]}${arr[21]}${arr[22]}${arr[23]}${arr[24]}${arr[25]}`
      }
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
  },

  bindChange(e) {
    let timeData = e.detail
    this.setData({
      timeData
    })
  },
  bindChange2(e) {
    let timeData2 = e.detail
    this.setData({
      timeData2
    })
  },
  submitTime(){
    console.log('开机',this.data.timeData)
    console.log('关机',this.data.timeData2)
    // 开启或关闭
    let check_num;
    if (this.data.checked == 'true'){
      check_num = '01'
    }else{
      check_num = '02'
    }

    // 周一到周五或者周六到周日
    let mode;
    if (this.data.mode == '1') {
      mode = '01'
    } else {
      mode = '02'
    }

    // let timeData = `${this.data.timeData.hours}${this.data.timeData.minute}`
    // let timeData2 = `${this.data.timeData2.hours}${this.data.timeData2.minute}`
    let params = []
    params[0] = mode
    params[1] = check_num
    params[2] = this.data.timeData.hours
    params[3] = this.data.timeData.minute
    params[4] = this.data.timeData2.hours
    params[5] = this.data.timeData2.minute
    // var params = `${mode}${check_num}${timeData}${timeData2}`
    var narr = params.map(v=>{
      let x = v.toString(16)
      if (x.length < 2){
        x = '0' + x
      }
      return x
    })
    console.log(narr.join(''))
    api.post(urlObj.push_msg, { device_mac: this.data.mac, code: '3003', msg: narr.join('') }).then(r => {
      if (r.errcode == 0){
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(()=>{
          wx.navigateBack({
            mac: this.data.mac
          })
        },2000)
      }
     })
  }
})