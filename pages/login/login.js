// pages/login/login.js
import api from '../../api/api'
import {
  urlObj
} from '../../api/url'
var app = getApp()
var utilMd5 = require('../../utils/md5.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: null,
    unionid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.bindGetUserInfo()
  },
  bindGetUserInfo() {
    wx.showLoading({})
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo'] === true) { // 成功授权
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          wx.getUserInfo({
            success: res => {
              // console.log(res.userInfo)
              app.globalData.userInfo = res.userInfo
              this.setUserInfoAndNext(res)
            },
            fail: res => {
              // console.log(res)
            }
          })
        } else if (res.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
          wx.openSetting({
            success: res => {
              // console.log(res)
            },
            fail: res => {
              // console.log(res)
            }
          })
        } else { // 没有弹出过授权弹窗
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setUserInfoAndNext(res)
            },
            fail: res => {
              // console.log(res)
              wx.openSetting({
                success: res => {
                  // console.log(res)
                },
                fail: res => {
                  // console.log(res)
                }
              })
            }
          })
        }
      }
    })
  },
  // 获取个人信息成功，然后处理剩下的业务或跳转首页
  setUserInfoAndNext(res) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
    wx.hideLoading()
    wx.switchTab({
      url: '../equipment/equipmentList/equipmentList'
    })
    wx.hideLoading()
    // 微信登录
    // wx.login({
    //   success: res => {
    //     // console.log(res)
    //     this.setData({
    //       code: res.code
    //     })
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     this.getOpenId()
    //   }
    // })
  },
  // 获取unionid
  // getOpenId() {
  //   var that = this
  //   let code = this.data.code
  //   api.post(urlObj.push_code, { code: code }).then((r) => {
  //     if (r.errcode == 0) {
  //       console.log(r)
  //       wx.setStorageSync('openid', r.data.openid)
  //       app.globalData.openid = r.data.openid
  //       let unionid = r.data.unionid
  //       this.setData({
  //         unionid
  //       })
  //       that.login()
  //     }
  //   })
  // },

  // //第三方登录
  // login() {
  //   api.post(urlObj.login, { openid: this.data.unionid, type: 2 }).then((r) => {
  //     if (r.errcode == 0) {
  //       console.log(r)
  //       wx.setStorageSync("loginInfo", r.data)
  //       wx.hideLoading()
  //       // 跳转首页
  //       setTimeout(() => {
  //         wx.reLaunch({
  //           url: '../equipment/equipmentList/equipmentList'
  //         })
  //       }, 1000)

  //     }
  //   })
  // },
})