const BASE_URL = 'https://cnodejs.org/api/v1'
export default {
  // 发出请求时的回调函数
  config(config) {
    config.url = BASE_URL + config.url
    // 请求前设置token
    // const accesstoken = wx.getStorageSync('accesstoken')
    // if (accesstoken) {
    //   config.header = {
    //     'X-Token': accesstoken
    //   }
    // }
    console.log('request before config: ', config);
    // 必须返回OBJECT参数对象，否则无法发送请求到服务端
    this.showLoading({
      title: '加载中',
      mask: true,
    })
    return config;
  },

  // 请求成功后的回调函数
  async success(resp) {
    let errorMesg = resp.data.error_msg || ''
    // 可以在这里对收到的响应数据对象进行加工处理
    switch (resp.statusCode) {
      // case 200:
      //   const { success, error_msg: message } = resp.data
      //   if (!success) {
      //     errorMesg = message || '未知错误'
      //   }
      //   break
      // case 401:
      //   console.log('未登陆,拦截重定向登陆界面')
      //   await this.redirectTo({
      //     url: 'login'
      //   })
      //   break
      case 403:
        console.log('未授权接口,拦截')
        this.showModal({
          title: '警告',
          content: (resp.data.error && (resp.data.error.details || resp.data.error.message)) || '无权请联系管理员',
          confirmText: '我知道了',
          showCancel: false,
        })
        throw new Error(errorMesg)
      case 500:
      case 502:
        errorMesg = (resp.data.error && (resp.data.error.details || resp.data.error.message)) || '服务器出错'
        break
      case 503:
        errorMesg = '哦～服务器宕机了'
        break
    }
    if (errorMesg.length > 0) {
      this.showToast({
        title: errorMesg,
        icon: 'none',
      })
      // throw new Error(errorMesg)
    }
    return resp.data.data || resp.data
  },

  // 请求失败后的回调函数
  fail(resp) {
    console.log('request fail: ', resp);
    // 必须返回响应数据对象，否则后续无法对响应数据进行处理
    this.showToast({
      title: resp.errMsg,
      icon: 'none',
    })
    return resp;
  },

  // 请求完成时的回调函数(请求成功或失败都会被执行)
  complete(resp) {
    this.hideLoading()
  },

}
