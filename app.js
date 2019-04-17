//app.js
var MQTT = require('./utils/paho-mqtt-min.js');
// console.log(MQTT)

App({
  data: {
    mqtt:'',
    deviceInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLaunch: function () {
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.reLaunch({
            url: '../../login/login'
          })
        }
      }
    })
    //mqtt
    this.nmqtt()
    this.data.deviceInfo = wx.getSystemInfoSync();
  },
  onShow(){
  },
  getString() {
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    for (var i = 0; i < 20; i++) {
      tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
  },
  nmqtt(){
    var that = this
    var client = new MQTT.Client('wss://api.ourslinks.com/mqtt', that.getString());
  
    client.onConnectionLost = onConnectionLost;
    //client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect, reconnect: true});

    that.globalData.mqtt = client
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      // wx.showToast({
      //   title: '设备已连接',
      //   icon: 'success',
      //   duration: 1500
      // });
      // client.subscribe("dt2014/app/F0FE6BF91DC7");
      //var message = new MQTT.Message("Hello");
      //message.destinationName = "/World";
      //client.send(message);
    };
    function onConnectionLost(responseObject) {
      // wx.showToast({
      //   title: '设备连接已断开',
      //   icon: 'none',
      //   duration: 15000
      // });
      if (responseObject.errorCode !== 0){
      }
        console.log("onConnectionLost:" + responseObject.errorMessage);
    };
    function onMessageArrived(message) {
    };
  },
    globalData: {
    userInfo: null,
    loginInfo: wx.getStorageSync('loginInfo') || {},
    host: "http://api.ourslinks.com/index.php/",
    openid: null,
    common: {
      productId: 50863,
      mac: "000000000000",
      version: "100",
      platform: 3,
    },     
    xx: ['EE', 'EE', 'XX', 'XX', '00'],
      // device_mac: 'F0FE6BF91E08',
      // device_mac: 'F0FE6BF91DC7',
    device_mac: '',
    equipmentState:{
      open:'',
      hdSwich:'',
      mode:'',
      light:'',
      heating:''
    },
    mqtt:''
  },
  
})