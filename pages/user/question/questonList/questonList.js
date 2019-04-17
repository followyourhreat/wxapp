// pages/user/question/questonList/questonList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [{
      title: 'Perifis采暖器适合什么样的人群使用？',
        id: 1,
        
      },
      {
        title: '在南方，有了空调还需要装暖气吗？',
        id: 2
      },
      {
        title: '装Perifis采暖器要多少钱？',
        id: 3
      },
      {
        title: '每个月电费大概要多少？',
        id: 4
      },
      // {
      //   title: '如何选配各房间的产品型号？',
      //   id: 5
      // },
      {
        title: '产品使用寿命有多长？如何质保？',
        id: 6
      },
      // {
      //   title: '产品安全吗？',
      //   id: 7
      // },
      // {
      //   title: '如何购买？',
      //   id: 8
      // },
      {
        title: '我自己可以安装吗？',
        id: 9
      },
      // {
      //   title: '使用过程中有那些注意事项？',
      //   id: 10
      // },
      {
        title: '设备重置问题？',
        id: 11
      },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  gotodetail(e) {

    let {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  }
})