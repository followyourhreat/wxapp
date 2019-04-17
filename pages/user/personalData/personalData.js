// pages/user/personalData/personalData.js
import api from '../../../api/api'
var app = getApp()
import {
  urlObj
} from '../../../api/url'
Page({
      /**
       * 页面的初始数据
       */
      data: {
        // "../../../images/head.png"
        user: {
          nickname: '',
          head: '',
          sex: '',
          userId: ''
        },
        date:'',
        headImg:'',
        sex:'',
        nickname:'',
        age: '18',
        nickValue: "",
        hiddenmodalput: false,
        visible1: false,
        actions1: [{
            name: '相机',
          },
          {
            name: '从相册中选取',
            color: ""
          }
        ],
        data: '',

      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
        this.init()
        this.setData({
          nickname: app.globalData.userInfo.nickName,
          sex: app.globalData.userInfo.gender == "1" ? '男' : '女',
          headImg: app.globalData.userInfo.avatarUrl
        })
      },
      init() {
        var that = this
        let loginInfo = wx.getStorageSync('loginInfo')
        let params = {
          uid: loginInfo.uid,
          token: loginInfo.token,
        }
        api.post(urlObj.get_user_info, params).then((res) => {
          // console.log(res)
          if (res.errcode == 0) {
            // console.log(res.data.birth)
            var age = that.jsGetAge(res.data.birth)

            that.setData({
              user: res.data,
              age,
              date: res.data.birth
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

      push_set_user_info(info) {
        let loginInfo = wx.getStorageSync('loginInfo')
        let param = {
          uid: loginInfo.uid,
          token: loginInfo.token,
        }
        let params = Object.assign({}, param, info)
        api.post(urlObj.set_user_info, params).then((res) => {
          // console.log(res)
          if (res.errcode == 0) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(() => {
              this.init()
            }, 1500)

          }
        })
      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function() {

      },
      editInfo() {
        return false
        this.setData({
          visible1: true
        })
      },
      handleCancel1() {
        this.setData({
          visible1: false
        });
      },
      handleClickItem1({
        detail
      }) {
        const index = detail.index + 1;
        // console.log(index)
        if (index == 1) {
          let type = ['camera']
          this.chooseMyHead(type)
        } else if (index == 2) {
          let type = ['album']
          this.chooseMyHead(type)
        }
      },

      chooseMyHead(type) {
        var that = this
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: type, // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            console.log(res)
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths
            console.log(tempFilePaths)

            wx.uploadImage({
              localId: tempFilePaths[0], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
                console.log(res)
              }
              })
            // wx.uploadFile({
            //   url: urlObj.set_user_info, //仅为示例，非真实的接口地址
            //   filePath: tempFilePaths[0],
            //   name: 'file',
              
            //   success(res) {
            //     // console.log(res)
            //     //do something
            //   }
            // })
            that.setData({
              visible1: false,
              tempFilePaths: tempFilePaths
            })
          }
        })
      },
      // 上传头像
      upload(){

      },
      //编辑
      editnickName() {
        this.setData({
          hiddenmodalput: true
        })
      },
      //取消按钮  
      cancel: function() {
        this.setData({
          hiddenmodalput: false
        });
      },
      //确认  
      nikeValue_blur(e) {
        this.setData({
          nickValue: e.detail.value
        })
      },
      confirm: function(e) {
        // console.log(e)
        let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/
        if (reg.test(e.currentTarget.dataset.nickname)) {
          let nickname = {
            nickname: e.currentTarget.dataset.nickname
          }
          this.push_set_user_info(nickname)
          this.setData({
            hiddenmodalput: false
          })
        }else{
          wx.showToast({
            title: '昵称格式不符合或过长',
            icon: 'none',
            duration: 1500
          });
        }
      },

      editSex() {
        var that = this
        wx.showActionSheet({
          itemList: ['男', '女'],
          success: function(res) {
            if (!res.cancel) {
              // console.log(res.tapIndex)
              let osex = res.tapIndex == "0" ? "1" : "2"
              that.push_set_user_info({
                sex: osex
              })
            }
          }
        });
      },

      // 日期选择
      bindDateChange(e) {
        // console.log(e.detail.value)
        let params = e.detail.value
        this.push_set_user_info({
          birth: params
        })
      },

      /*根据出生日期算出年龄*/
      jsGetAge(strBirthday) {
        var returnAge;
        var strBirthdayArr = strBirthday.split("-");
        var birthYear = strBirthdayArr[0];
        var birthMonth = strBirthdayArr[1];
        var birthDay = strBirthdayArr[2];

        var d = new Date();
        var nowYear = d.getFullYear();
        var nowMonth = d.getMonth() + 1;
        var nowDay = d.getDate();

        if (nowYear == birthYear) {
          returnAge = 0; //同年 则为0岁
        } else {
          var ageDiff = nowYear - birthYear; //年之差
          if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
              var dayDiff = nowDay - birthDay; //日之差
              if (dayDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            } else {
              var monthDiff = nowMonth - birthMonth; //月之差
              if (monthDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            }
          } else {
            returnAge = 0; //返回-1 表示出生日期输入错误 晚于今天
          }
         
        }

        return returnAge; //返回周岁年龄
      }
      })