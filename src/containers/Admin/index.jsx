import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
// import { reqCategoryList } from '../../api/index'
import { createDeleteUserInfoAction } from '../../redux/actions_creators/login_action'
import './css/admin.less'
import Header from './Header'
import Home from '../../components/Home'
import Category from '../Category'
import Product from '../Product'
import Detail from '../Product/detail'
import AddUpdate from '../Product/add_update'
import User from '../User'
import Role from '../Role'
import Pie from '../Pie'
import Bar from '../Bar'
import Line from '../Line'
import LeftNav from './left_nav/left_nav'
const { Footer, Sider, Content } = Layout;
//如下代码中的所有key是控制容器组件传递给UI组件的key
//如下代码中的所有value是控制容器组件传递给UI组件的value

@connect(
  state => ({ userInfo: state.userInfo }),
  {
    deleteUserInfo: createDeleteUserInfoAction
  }
)
class Admin extends Component {
  componentDidMount() {
    // console.log(this.props);
  }

  //
/*   demo = async () => {
    let result = await reqCategoryList()
    // console.log(result);
  } */
  //在render里，若想实现跳转，最好用<Redirect>              
  render() {
    //从redux中获取user和isLogin
    const { isLogin } = this.props.userInfo
    if (!isLogin) {

      console.log('没有登录');
      return <Redirect to="/login" />
    } else {
      console.log('登录了');
      return (
        <>
          <Layout className="admin">
            <Sider className="sider">
              <LeftNav />
            </Sider>
            <Layout>
              <Header className="header">Header</Header>
              <Content className="content">
                <Switch>
                  <Route path="/Admin/Home" component={Home} />
                  <Route path="/Admin/prod_about/Category" component={Category} />
                  <Route path="/Admin/prod_about/Product" component={Product} exact />
                  <Route path="/Admin/prod_about/Product/detail/:id" component={Detail} />
                  <Route path="/Admin/prod_about/Product/add_update/:id" component={AddUpdate} />
                  <Route path="/Admin/prod_about/Product/add_update" component={AddUpdate} exact />
                  <Route path="/Admin/User" component={User} />
                  <Route path="/Admin/Role" component={Role} />
                  <Route path="/Admin/charts/Pie" component={Pie} />
                  <Route path="/Admin/charts/Line" component={Line} />
                  <Route path="/Admin/charts/Bar" component={Bar} />
                  <Redirect to="/Admin/Home" />

                </Switch>
              </Content>
              <Footer className="footer">
                推荐使用谷歌浏览器，获取最佳用户体验
              </Footer>
            </Layout>
          </Layout>
        </>
      )
    }
  }
}

export default Admin
/* export default connect(
    state => ({userInfo:state.userInfo}),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
  )(Admin) */
