import axios from 'axios'
import { message } from 'antd'
const Store = window.require('electron-store')
const store = new Store({ name: 'token' })
// import { verifySecondPassword } from '@/api/user'

// create an axios instance
const service = axios.create({
  baseURL: process.env.REACT_APP_API2, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (configs) => {
    // do something before request is sent
    configs.headers['Content-Type'] = 'application/json;charset=UTF-8'
    configs.headers['version'] = 'v2'
    configs.headers['X-Request-Token'] = store.get('token')
    return configs
  },
  (error) => {
    return Promise.reject(error)
  },
)

let errorMessage: string
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    // const { code } = res

    if (res.msg) {
      if (errorMessage !== res.msg) {
        errorMessage = res.msg
        message.error(res.msg)
      }
    }

    return res
  },
  (error) => {
    const status = error.response ? error.response.status : null
    switch (status) {
      case 400:
        error.message = '请求错误'
        break
      case 401:
        error.message = '未授权，请登录'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器内部错误'
        break
      case 501:
        error.message = '服务未实现'
        break
      case 502:
        error.message = '网关错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网关超时'
        break
      case 505:
        error.message = 'HTTP版本不受支持'
        break
      default:
        break
    }
    if (status) {
      if (errorMessage !== error.message) {
        errorMessage = error.message
        message.error(error.message)
      }
    }

    console.log('请求返回失败:', error.toJSON()) // for debug
    return Promise.reject(error)
  },
)

export default service
