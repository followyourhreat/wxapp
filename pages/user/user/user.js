// pages/user/user/user.js
import api from '../../../api/api'
import {urlObj} from '../../../api/url'
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userData:{
      head: "../../../images/head.png",
      name:'',
      title:''
    },
    headImg:'',
    nickname: '',    
    settingList: [

      {
        icon: "../../../images/question.svg",
        title: "常见问题",
        // url: "../question/detail/detail",
        url: "../question/questonList/questonList",        
        setting: 0

      },
      {
        icon: "../../../images/pingjia.svg",
        title: "意见反馈",
        url: "../feedback/feedback",
        setting: 0

      },
      {
        icon: "../../../images/user.svg",
        title: "关于我们",
        url: "../about/about",
        setting: 1
      },
    ],
    setting: {
      icon: "../../../images/Rectangle 28.png",
      title: "设置",
      url: "../user-setting/user-setting",
      setting: 0
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.init()

      this.setData({
        nickname: app.globalData.userInfo.nickName,        
        headImg: app.globalData.userInfo.avatarUrl
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  init(){
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
    }
    api.post(urlObj.get_user_info, params).then((res) => {
      if(res.errcode == 0){
        this.setData({
          userData: res.data
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
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

  editInfo(){
    wx.navigateTo({
      url: '../personalData/personalData',
    })
  }
})