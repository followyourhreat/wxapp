// pages/component/timer/timer.js
var timeList = []
var timeList2 = []
var index = [0,0]
for(let i = 0; i< 24 ;i++){
  let time = 0;
  if(i<10){
    time = '0' + i
  }else{
    time = i
  }
  timeList.push(time)
}
for (let i = 0; i < 60; i++) {
  let time = 0;
  if (i < 10) {
    time = '0' + i
  } else {
    time = i
  }
  timeList2.push(time)
}

// var timeData = timeList[index[0]] + ":" + timeList[index[1]]

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    timeList: timeList,
    timeList2: timeList2,
    timeData: null,
    value:[0,0]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function (e) {
      // console.log(e)
      var value = e.detail.value;
      let timeData = {}
      timeData.hours = timeList[value[0]]
      timeData.minute = timeList2[value[1]]
      this.setData({
        timeData
      })
     
      this.triggerEvent("_bindChange", timeData)
    }
  }
})
