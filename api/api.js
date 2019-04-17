const app = getApp()
// var utilMd5 = require('../utils/md5.js');
var md5 = require('../utils/newmd5.js')

const request = (url, options) => {
  // var timers =  setTimeout(()=>{
  //   wx.showLoading({
  //     title: '加载中...'
  //   })
  // },3000)

  // wx.showLoading({
  //   title:'正在努力加载...'
  // })
  return new Promise((resolve, reject) => {
    wx.request({
      // url: `${app.globalData.host}${url}`,
      url: url,
      method: options.method,
      // data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      data: options.data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        // 'x-token': 'x-token' // 看自己是否需要
      },
      success(request) {
        if (request.data.errcode === 0) {
          resolve(request.data)
        } else {
          reject(request.data)
        }
        // clearTimeout(timers)
        // wx.hideLoading()
        // resolve(request.data)
      },
      fail(error) {
        reject(error.data)
      }

    })
  })
}
// 处理数据签名和用户信息
let signKey = "0ueymhzRrqXf77tUl0TAN3OBJjqqpOXg";
const dealSign = function (params = {}) {
  var commonParams = app.globalData.common
  const arr = [];
  let nparams = Object.assign({}, commonParams, params)
  const rtime = Date.parse(new Date());
  nparams.rtime = rtime;
  nparams.sign = '';
  Object.keys(nparams).forEach(function (item) {
    const val = nparams[item];
    if (val != null && val !== '' && typeof val !== 'object') {
      arr.push(`${item}=${nparams[item]}`);
    }
  });
  arr.sort();
  arr.push(`key=${signKey}`);

  const str = arr.join('&');
  // console.log(str)
  // const sign = utilMd5.hexMD5(str);
  const sign = md5(str);
  nparams.sign = sign;
  // console.log(nparams)
  return nparams;
}

const get = (url, options = {}) => {
  return request(url, {
    method: 'GET',
    data: options
  })
}

const post = (url, options) => {

  let noptions = dealSign(options)

  return request(url, {
    method: 'POST',
    data: noptions
  })
}

module.exports = {
  get,
  post,

}