// pages/message/message.js
import api from '../../api/api'
import { urlObj } from '../../api/url'
var getTime = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: 400,
    dataArray:[
      // {
      //   title:"消息标题",
      //   content:"如果你无法简单的表达你的想法，那说明你还不够了解他",
      //   time:"09:30",
      //   showspot:true
      // },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          clientHeight: res.windowHeight - 46
        })
      }
    })

    this.init()
  },
  init(){
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      device_type:0,
      page:1
    }
    // 消息设置为已读
    api.post(urlObj.set_message, params).then((res) => {
      wx.hideTabBarRedDot({index: 0})
    })

    api.post(urlObj.get_list2, params).then((r)=>{
      if (r.errcode == 0){
        let dataArray = r.data
        dataArray.forEach((r)=>{
          r.time = getTime.formatTime(new Date(r.ctime*1000))
        })
        // var dates = new Date(1469157217)
        // console.log(dates)
        // var t = getTime.formatTime(dates)
        // console.log(t)
        this.setData({
          dataArray
        })
      }else{

      }
    }).catch((e) => {
      // console.log(e)
      if (e.errcode == 400011) {
        wx.showToast({
          icon: 'none',
          title: '没有数据',
          duration: 5000
        })
        this.setData({
          dataArray: []
        })
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

  /**
* cell绑定事件,滑动触发
*/
  slideAction: function (e) {
    console.log(e)
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

    // console.log(this.data.lastSlideSender)
  },

  //删除
  deleteAction(e) {
    var that = this
    let index = e.detail.row
    let id = this.data.dataArray[index].id
    let loginInfo = wx.getStorageSync('loginInfo')
    let params = {
      uid: loginInfo.uid,
      token: loginInfo.token,
      id: id
    }
    // let index = e.detail.row
    // let dataArray = this.data.dataArray
    // dataArray.splice(index, 1)
    // this.setData({
    //   dataArray
    // })
    // 消息删除
    api.post(urlObj.del_message, params).then((res) => {
      if (res.errcode == 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1500
        });
        this.init()
      }
    })
  },

  handleRouter(e) {
    wx.navigateTo({
      url: '../user/question/detail/detail?id=11'
    })
  }
})