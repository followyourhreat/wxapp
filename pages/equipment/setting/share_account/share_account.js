// pages/equipment/setting/share_account/share_account.js
import api from '../../../../api/api'
import {
  urlObj
} from '../../../../api/url'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adminUid:'',
    userList: [
      {
        phone: '123456789'

      },
      {
        phone: '123456789'

      }
    ],
    userUid:'',
    dataId: '',
    shareValue:'',
    device_id:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      dataId: options.id,
      device_id: options.device_id
    })
    this.init()
  },
  init(){
    var that = this
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      device_id: that.data.device_id,
    }
      let params2 = {
        uid: loginInfo.uid,
        token: loginInfo.token,
      }
      api.post(urlObj.get_user_info, params2).then((res) => {
        console.log(res)
        if (res.errcode == 0) {
          that.setData({
            userUid:res.data.uid
          })

          console.log(that.data.userUid)
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


    api.post(urlObj.get_device_bind_user, params).then(r=>{
      if(r.errcode === 0){
        console.log(r)
          var list = r.data;
          var list2 = r.data;
          var arr = list.find(item => item.uid == r.admin_uid)
          var arr2 = list2.filter(item => item.uid != r.admin_uid)
          arr2.unshift(arr)
          // list.forEach(item => {
          //   console.log(item)
          // })
          that.setData({
            adminUid: r.admin_uid,
            userList: arr2
          })
      }
    }).catch((e)=>{
      let msg = e.errmsg
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
      });
      if (e.errcode === 400006){
        that.setData({
          userList:[]
        })
      }
    })
  },
  // 分享
  pushShare() {

    var that = this
    if (that.data.shareValue == '') {
      wx.showToast({
        title: '用户ID不能为空',
        icon: 'none',
        duration: 2000
      });
      return
    }
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      id: that.data.dataId,
      tuid:that.data.shareValue
    }
    api.post(urlObj.share, params).then((x)=>{
      // console.log(x)
      if (x.errcode === 0){
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          shareValue:''
        })
        setTimeout(()=>{
          that.init()
        },2000)
        
      }
    }).catch((err)=>{
      let msg = err.errmsg
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
      });
    })
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
  shareValue(e){
    // console.log(e)
    let shareValue = e.detail.value
    this.setData({
      shareValue
    })
  },

  deleteUserConfirm(e){
    var that = this
    let del_uid = e.currentTarget.dataset.uid
    // console.log(e.currentTarget.dataset.uid)
    wx.showModal({
      title: '确定要删除吗？',
      confirmText: "确定",
      cancelText: "取消",
      success:(res)=>{
        if (res.confirm) {
          that.deleteUser(del_uid)
        } else {
        }
      }
    });
  },
  deleteUser(del_id){
    var that = this
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      device_id: that.data.device_id,
      del_uid: del_id
    }
    api.post(urlObj.del_device_bind_user, params).then(r => {
      // console.log(r)
      if (r.errcode === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(()=>{
          that.init()
        },2000)
      }
    }).catch((e)=>{
      let err = e.errmsg
      wx.showToast({
        title: err,
        icon: 'success',
        duration: 2000
      });
    })
  }
})