// pages/user/question/detail/detail.js
const content = require('../../../../utils/content.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    image:"../../../../images/content5.png",
    question:{
      title:'',
      content:"",
      image:""
    },
    content: content.content
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      this.setData({
        id: options.id
      })

    this.init()
  },
  init(){
    var that = this
    this.data.content.map((v)=>{

      if (v.id == that.data.id){

        if (v.image){
          that.setData({
            'question.image': v.image,
          })
        }
        that.setData({
          'question.title': v.title,
          'question.content': v.content,
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