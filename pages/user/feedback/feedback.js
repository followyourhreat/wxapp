// pages/user/feedback/feedback.js
import api from '../../../api/api'
import { urlObj } from '../../../api/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textAreaValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  bindFormSubmit: function (e) {
    if (e.detail.value.textarea == ''){
      wx.showToast({
        title: '反馈内容不能为空',
        icon:'none',
        duration: 1500
      })
      return
    }
    console.log(e.detail.value.textarea)
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      content: e.detail.value.textarea,
      //产品类型
      type_id:'3051'
    } 
    api.post(urlObj.user_feedback, params).then((r)=>{
      if (r.errcode == 0){
        wx.showToast({
          title: '反馈成功',
          icon: 'success',
          duration: 2000
        });


        this.setData({
          textAreaValue:''
        })
      }
    })
  }
})