// 接口列表
var host = 'https://api.ourslinks.com/index.php/'
const urlObj = {
  // 登录
  login: host+'new/user/third_login',
  //getopenid
  push_code: host+'saiya/wechat/get_open_id',
  //获取用户设备
  get_user_device: host +'device/get_user_device',
  // 获取天气
  getweather: host +"weather",
  // 发送指令
  push_msg: host+"device/push_msg",
  // 删除所有绑定的用户
  del_all_user: host+"device/del_device_bind_all_user",
  //设备重命名
  rename: host + 'device/rename',
  //设备解绑
  del_device: host +'device/del_user_device',
  //获取用户资料
  get_user_info: host + 'new/user/get_user_info',
  //修改用户资料
  set_user_info: host + 'new/user/set_user_info',
  //用户反馈
  user_feedback: host + 'new/feedback/user_feedback',
  //获取设备类型
  get_list2: host + 'new/message/get_list2',
  //分享用户
  share: host + 'device/share_to_user',
  // 获取设备的绑定用户
  get_device_bind_user: host + 'device/get_device_bind_user',
  // 删除绑定设备的用户
  del_device_bind_user: host + 'device/del_device_bind_user',
  // 获取是否有未读消息
  get_message: host + 'new/message/get_user_message_remind',
  // 设置已读消息
  set_message: host + 'new/message/set_user_message_read',
  // 删除消息
  del_message: host + 'new/message/del',  
}

module.exports = {
  urlObj
}