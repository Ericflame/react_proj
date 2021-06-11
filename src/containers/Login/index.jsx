import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { connect } from 'react-redux'
import { createSaveUserInfoAction } from '../../redux/actions_creators/login_action'
import './css/login.less'
import { reqLogin } from '../../api'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import logo from './img/dora_17.png'
import { Redirect } from 'react-router-dom';
const { Item } = Form

const Login = (props) => {
  const [form] = Form.useForm();
  // 如果用户已经登录 自动跳转到管理界面
  /* const user = props.user
  if (user._id) {
    return <Redirect to='/home'/>
  } */
  // 点击登录按钮的回调
  const onFinish = (async (values) => {
    // console.log('Received values of form: ', values);

    // 请求登录
    const { username, password } = values

    /* reqLogin(username,password).then(response => {
      console.log('成功了',response.data);
    }).catch(error => {
      console.log('失败了',error.message);
    }) */

    //#region 
    // 优化1

    const result = await reqLogin(username, password)
    let { data, status, msg } = result
    // {status:0, data:user}  {status:1,msg:'xxx'}
    if (status === 0) {  //登录成功
      // 提示登录成功
      // console.log('请求成功了',data);
      message.success('登录成功')
      // 跳转到admin界面（不需要再回退回到登录）
      props.saveUserInfo(data)
      props.history.replace('/Admin')

    } else {   //登录失败
      message.warning(msg, 1)  //提示错误信息
    }

  });


  const NameValidator = (value) => {
    if (value) {
      if (value.length >= 4 && value.length <= 30) {
        return Promise.resolve()
      } else {
        return Promise.resolve()/* reject('名称长度为4-30个字符，一个中文字等于2个字符') */
      }
    } else {
      return Promise.resolve()
    }
  };

  const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
  };

  const { isLogin } = props
  if (isLogin) {
    return <Redirect to="/Admin/Home" />
  }
  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo" />
        <h1>后台管理系统{props.test}</h1>
      </header>
      <section className="login-content">
        <h1>用户登陆</h1>

        <Form form={form} name="normal_login" className="login-form"
          initialValues={{
            remember: true,
            username: '云显靖'
          }}
          onFinish={onFinish}
        // onSubmit={handleSubmit}
        >
          <Item
            name="username"
            // 声明式验证：直接使用别人定义好的验证规则进行验证
            rules={[
              { required: true, whitespace: true, message: '请输入用户名!' },
              { min: 4, message: '用户名最少4位' },
              { max: 12, message: '用户名最多12位' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文 数字或者下划线组成' },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" style={{ color: 'rgba(0,0,0,.25)' }} />
          </Item>
          <Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              }, { validator: NameValidator, }
            ]}
          >
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" style={{ color: 'rgba(0,0,0,.25)' }} />
          </Item>
          <Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
              </Button>
          </Item>
        </Form>
      </section>
    </div>
  );
};
// 暴露容器
export default connect(
  state => ({ isLogin: state.userInfo.isLogin }),
  {
    saveUserInfo: createSaveUserInfoAction
  }
)(Login)

