// pages/user/user-setting/user-setting.js
import api from '../../../api/api'
import {
  urlObj
} from '../../../api/url'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked1: true,
    checked2: true,
    checked3: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)
    this.init()
  },
  
  init() {
    var that = this
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
    }
    api.post(urlObj.get_user_info, params).then((res) => {
      if (res.errcode == 0) {
        that.setData({
          checked3: res.data.is_notice == "1" ? true : false
        })
      }
    }).catch((e) => {
      if (e.errcode == 400006) {
        wx.showToast({
          icon: 'none',
          title: '请重新登陆',
          duration: 2000
        })
      }
    })
  },

  switch1Change(e){
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      is_notice: e.detail.value?'1':'0'
    }
    api.post(urlObj.set_user_info, params).then((res) => {
      // console.log(res)
      if (res.errcode == 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1500
        });
      }
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