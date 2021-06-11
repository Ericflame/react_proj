import React, { Component } from 'react'
import { Button, Table, Modal, Card, message } from 'antd'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import { PAGE_SIZE } from '../../config/index.js'
// import { formateDate } from '../../utils/dateUtils'
// import LinkButton from '../../components/link-button/index'
import {/* reqDeleteUser, */ reqUsers, reqAddOrUpdateUser } from '../../api/index'
import UserForm from './user-form'
// 用户路由
@connect(
    state => ({}),
    {}
)
class User extends Component {
    state = {
        users: [],  //用来存放用户列表的数组
        roles: [],  //所有角色的列表
        isShow: false,  //是否显示对话框
    }


    getUserList = async () => {
        let result = await reqUsers()
        const { status, data, msg } = result
        // console.log(data);
        if (status === 0) {
            this.setState({
                users: data.users.reverse(),
                roles: data.roles
            })
            message.success('获取用户列表成功')
        } else {
            message.error(msg, 1)
        }
    }
    componentDidMount() {
        this.getUserList()
    }
    /* // 根据role的数组，生成包含所有角色名的对象(属性名用角色id值)
    initRoleNames = (roles) => {
      const roleNames = roles.reduce((pre,role) => {
        pre[role._id] = role.name
        return pre
      },{})
      //保存值
      this.roleNames = roleNames
    }
    // 显示修改界面
    showUpdate = (user) => {
      // 保存user的值
      this.user = user
      // 显示界面
      this.setState({
        isShow: true,
      })
    } */

    // 添加/更新用户
    handleOk = async () => {
        // console.log(this.form);
        // 收集输入数据
        const value = this.form.getFieldsValue()
        console.log(value);
        this.form.resetFields()

        // 如果是更新 需要给user指定_id属性
        if (this.value) {
            value._id = this.value._id
        }
        // 提交添加的请求
        let result = await reqAddOrUpdateUser(value)
        const { status, data, msg } = result
        if (status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功！`)
            let users = [...this.state.users]
            users.unshift(data)
            this.setState({
                users, isShow: false
            })
            // 更新显示的列表
            this.getUserList()
        } else {
            message.error(msg, 1)
        }
    }
    // 创建用户
    showAdd = () => {
        // 去除前面的user
        this.user = null
        this.setState({ isShow: true })
    }

    // 取消的回调
    handleCancel = () => {
        this.setState({ isShow: false })
        this.form.resetFields()
    }
    /* 
     // 删除指定用户
     deleteUser = (user) => {
       Modal.confirm({
         title: `确认删除${user.username}吗？`,
         onOk: async () => {
           const result = await reqDeleteUser(user._id)
           if (result.status === 0) {
             message.success('删除用户成功！')
             this.getUsers()
           }
         }
       })
     }
 
     UNSAFE_componentWillMount() {
       this.initColumns()
     }
 
     componentDidMount(){
       this.getUsers()
     } */

    render() {
        const { users, roles, isShow } = this.state
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                key: 'role_id',
                render: (id) => {
                    let result = this.state.roles.find((item) => {
                        return item._id === id
                    })
                    if (result) return result.name
                }
            },
            {
                title: '操作',
                key: 'option',
                render: () => (
                    <div>
                        <Button
                            type='link'
                        >修改
                  </Button>
                        <Button
                            type='link'
                        >删除
                  </Button>
                    </div>
                )
            }
        ];
        const title = <Button onClick={() => {
            this.setState({ isShow: true });
            // this.form.resetFields()
        }}
            type='primary'>创建用户</Button>
        const user = this.user || {}
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }} />

                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <UserForm roles={roles}
                        setForm={form => this.form = form}
                        user={user} />
                </Modal>
            </Card>
        )
    }
}
export default User
