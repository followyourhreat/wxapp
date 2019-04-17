// pages/user/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"Perifis源自意大利，流着纯正意大利品牌血统，英文品牌名称“Perifis”，中文品牌名称“佩芮菲斯”，产品外观及结构设计是由著名西班牙电暖气专家亲自设计，Perifis电暖气简约而不简单的外观设计、安全可靠的核心技术、倾心打造一款符合中国2.5亿中产阶级的新一代智能电暖器。走进Perifis，带你领略意大利电暖气的魅力！",
    clientHeight: 400,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          clientHeight: res.windowHeight
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