// pages/setting/index/index.js
import api from '../../../../api/api'
import { urlObj } from '../../../../api/url'
var app = getApp()
var device_mac = app.globalData.device_mac
// console.log(device_mac)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device_mac:'',
    dataId:'',
    device_id:'',
    settingList: [

      {
        icon: "../../../../images/Setting_icon_shareit.png",
        title: "账号分享",
        url: "../share_account/share_account",
        setting: 1
        
      },
      {
        icon: "../../../../images/Setting_icon_upgrade.png",
        title: "固件升级",
        url: "../firmware_upgrade/firmware_upgrade",
        setting: 2
        
      },
      {
        icon: "../../../../images/Setting_icon_time.png",
        title: "时间设置",
        url: "",
        setting: 3
      },
      {
        icon: "../../../../images/Setting_icon_restore.png",
        title: "重置设备",
        url: "",
        setting: 4
      },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    this.setData({
      device_mac: options.mac,
      dataId:options.id,
      device_id: options.device_id
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
  navigatorTo(e) {
    // console.log(e)
    var that = this
    let { url,setting,title } = e.currentTarget.dataset
    if (url === '') {
      if (setting === 3) {
        wx.showModal({
          content: '确认授时？',
          success: function(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              that.timeSignal()
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      } else if (setting === 4) {
        wx.showModal({
          title:"确认重置设备？",
          content: '设备重置后，所有绑定设备将清除，如需重新绑定需要先删除微信设置里面的设备',
          success: function (res) {
            if (res.confirm) {
              // 清除设备数据
              api.post(urlObj.push_msg, { device_mac: that.data.device_mac, code: '3008', msg: '00' }).then(r => { 
                if (r.errcode == 0) {
                  wx.showToast({
                    title: '重置设备完成',
                    icon: 'none',
                    duration: 2000
                  });
                }
              })
              // 删除所有绑定的用户
              let loginInfo = wx.getStorageSync('loginInfo')
              api.post(urlObj.del_all_user, { device_id: that.data.device_id, uid: loginInfo.uid, token: loginInfo.token }).then(r => { 
                if (r.errcode == 0) {
                  
                }
              })     
            } else if (res.cancel) {
              
            }
          }
        })
      }
      return
    }
    if (setting === 2){
      wx.showToast({
        title: '暂未开放',
        icon:'none',
        duration: 2000        
      })
      return
    }
    wx.navigateTo({
      url: url + '?id=' + this.data.dataId + '&device_id=' + this.data.device_id,
    })
  },

  timeSignal(){
    var that = this
    let newDate = new Date();
    let hours = newDate.getHours(); //获取系统时，
    let minues = newDate.getMinutes(); //分
    let seconds = newDate.getSeconds(); //秒
    let week = newDate.getDay(); //星期
    let arr = [hours, minues, seconds, week]
    let newArr = arr.map(x=>{
      let v = x.toString(16)
      if(v.length <2){
        v = '0'+v
      }
      return v
    })
    // console.log(newArr.join(''))
    api.post(urlObj.push_msg, { device_mac: that.data.device_mac, code: '3007', msg: newArr.join('') }).then(r => {
      if (r.errcode == 0){
        wx.showToast({
          title: '授时成功',
          icon: 'success',
          duration: 2000
        });
      }
     })   
  }
})