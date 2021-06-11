// 可以发送异步ajax请求的函数模块 封装ajax库
// 函数的返回值是一个promise对象

/* 
  1、优化1：统一处理请求异常
      在外层包一个自己创建的promise对象
      在请求出错时 不执行reject(error) 而是显示错误提示
  
  2、优化2：异步得到不是reponse 而是response.data
      在请求成功resolve时：resolve(response.data)
*/

import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd' 
import NProgress from 'nprogress'
import store from '../redux/store'
import {createDeleteUserInfoAction} from '../redux/actions_creators/login_action'
import 'nprogress/nprogress.css'

const instance = axios.create({
  timeout:4000
})


//请求拦截器
// Add a request interceptor
instance.interceptors.request.use((config) => {
  //进度条开始
  NProgress.start()
  // 从配置对象中获取method和data
  const {method,data} = config
  if(method.toLowerCase() === 'post'){
    if(data instanceof Object){
      config.data = qs.stringify(data)
    }
  }
  return config
  
});

//响应拦截器
// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    //进度条结束
    NProgress.done()
    //请求若成功
  return response.data;
}, 

    //请求若失败
  (error)=>{
    NProgress.done()
    if(error.response.status === 401){
      message.error('身份校验失败，请重新登录',1)
      // this.props.deleteUserInfo()
      //分发一个删除用户信息的action
      store.dispatch(createDeleteUserInfoAction())
    }else{
      message.error(error.message,1)
    }
  //请求若失败，提示错误（这里可以处理所有请求的异常）
  message.error(error.message,1)
  //中断Promise链
  return new Promise(()=>{})
});

export default instance

