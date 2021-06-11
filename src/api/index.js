/* 
  1.项目中所有请求由该文件发出
  2.以后每当发请求之前，都要在该文件里添加一个方法
*/
// https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=36cc4d40112f012a9568e75cd1d8332e
//引入我们自定义的myAxios
import myAxios from './myAxios'
import jsonp from 'jsonp'
import {message} from 'antd'
//引入请求的基本路径
import {BASE_URL,WEATHER_AK,CITY} from '../config'



//获取图片列表
export const reqPicsList = ()=> myAxios.get(`https://picsum.photos/v2/list`)

//发起登录请求
export const reqLogin = (username,password)=> myAxios.post(`${BASE_URL}/login`,{username,password})

//获取商品列表
export const reqCategoryList = ()=> myAxios.get(`${BASE_URL}/manage/category/list`)

//获取天气信息 
export const reqWeather = (cityCode) => {
  return new Promise((resolve,reject)=>{
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${CITY}&key=${WEATHER_AK}`
    // 发送jsonp请求
    jsonp(url,{},(err,data)=>{
      console.log(err,data);
      // 如果成功了
      if (!err && data.status === '1') {
        const {weather,city,temperature} = data.lives[0]
        // console.log(weather);
        let weatherObj = {weather,city,temperature}
        resolve(weatherObj)
      } else {
        // 如果失败了
        message.error('获取天气信息失败...')
        return new Promise(()=>{})
      }
    })
  })
}

// 添加分类
export const reqAddCategory = ({categoryName})=> myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})
//更新分类
export const reqUpdateCategory = ({categoryId,categoryName})=> myAxios.post(`${BASE_URL}/manage/category/update`,{categoryName,categoryId})
// 获取商品分页列表
export const reqProductList = (pageNum,pageSize)=> myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})
// 更新商品的状态(上架或下架)
export const reqUpdateProdStatus = (productId,status)=> myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})
// 搜索商品分页列表 (根据商品名称 / 商品描述)
// searchType: 搜索的类型, productName/productDesc
export const reqSearchProduct =  (pageNum,pageSize,searchType,keyWord)=> 
{
  console.log(pageNum,pageSize,searchType,keyWord);
  return myAxios.get(`${BASE_URL}/manage/product/search`,
{params:{pageNum,pageSize,
  // 将一个变量的值变成属性名 就要加[]
  [searchType]:keyWord}
})
}

//根据商品id获取商品信息
// export const reqProdById = (productId)=> myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})

//根据图片唯一名，删除图片
export const reqDeletePicture = (name)=> myAxios.post(`${BASE_URL}/manage/img/delete`,{name})
//请求添加商品
// export const reqAddProduct = (product)=> myAxios.post(`${BASE_URL}/manage/product/add`,product)
export const reqAddProduct = (productObj)=> myAxios.post(`${BASE_URL}/manage/product/add`,{...productObj})
//请求更新商品
export const reqUpdateProduct = (productObj)=> myAxios.post(`${BASE_URL}/manage/product/update`,{...productObj})
// 获取所有角色的列表
export const reqRoles = ()=> myAxios.get(`${BASE_URL}/manage/role/list`)
// 添加角色
export const reqAddRole = (roleName)=> myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})

// 更新角色
export const reqUpdateRole = (roleObj)=> myAxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,auth_time:Date.now()})

//获取用户列表
export const reqUsers = ()=> myAxios.get(`${BASE_URL}/manage/user/list`)

//请求添加用户
export const reqAddOrUpdateUser = (userObj)=> myAxios.post(`${BASE_URL}/manage/user/add`,{...userObj})

//删除指定用户
export const reqDeleteUser = (userId)=> myAxios.post(`${BASE_URL}/manage/user/delete`,{userId})

//添加/更新用户
// export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST') 