import React, { PureComponent } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { connect } from 'react-redux'
import { reqRoles, reqAddRole, reqUpdateRole,reqDeleteUser } from '../../api/index'
import dayjs from 'dayjs'
import ADDForm from './add-form'
import AuthForm from './auth-form'


// 角色路由
@connect(
    state => ({ username: state.userInfo.user.username }),
    {}
)
class Role extends PureComponent {
    state = {
        roles: [],  //用来存放各种角色的数组
        isShowAdd: false,  //是否显示添加界面
        isShowAuth: false, //是否显示设置权限界面
        _id: '',
        checkedKeys: []
    }
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    componentDidMount() {
        //发送请求获取角色列表数据
        this.getRoles()
    }
    // 获取角色的列表数据
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    // 修改指定用户


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

    // 添加角色成功的回调函数
    handleOk = () => {
        console.log("哈哈");
        //进行表单验证
        //   console.log(this.form);
        this.form.validateFields()
            .then(async (values) => {
                //隐藏确认框
                this.setState({ isShowAdd: false })
                //收集输入数据
                const { roleName } = values
                this.form.resetFields()
                // console.log(roleName);
                //发请求添加
                const result = await reqAddRole(roleName)
                const { msg, status } = result
                if (status === 0) {
                    message.success('新增角色成功')
                    this.getRoles()
                    this.setState({ isShowAdd: false })
                    // 更新roles状态  更新后的数据和之前的状态数据有关
                    /* this.setState(state=>({
                      roles: [...state.roles,role],
                      
                    })) */
                } else {
                    message.error(msg, 1)
                }
            }
            )
            .catch(errorInfo => {
                alert('出错', errorInfo)
            });
    }

    //取消添加角色的回调
    handleCancel = () => {
        this.form.resetFields()
        this.setState({ isShowAdd: false })
    }

    // 更新角色的回调函数
    updateRole = async () => {
        const menus = this.auth.current.getMenus()
        // const menu = menus.split('/').reverse()[0]
        const { _id } = this.state
        const { username } = this.props

        let result = await reqUpdateRole({ _id, auth_name: username, menus })
        const { status, msg } = result
        if (status === 0) {
            message.success('授权成功', 1)
            this.setState({ isShowAuth: false })
            this.getRoles()
        } else {
            message.error(msg, 1)
        }
        /* 
         // 隐藏确认框
         this.setState({
           isShowAuth: false
         })
         // 得到最新的menus
         role.menus = menus
         role.auth_name = memoryUtils.user.username
         console.log(role); */
        // 请求更新
        /* const result = await reqUpdateRole(role)
        if (result.status === 0) {
          // 如果当前更新的是自己角色的权限 需要强制退出
          if (role._id === memoryUtils.user.role_id) {
            // 清空本地存储
            memoryUtils.user = {}
            storageUtils.removeUser()
            this.props.history.replace('/login')
            message.success('用户权限已更新,请重新登录!')
          } else {
            message.success('设置权限成功')
            // 获取显示列表的两种方式
            // this.getRoles()
            this.setState({
              roles: [...this.state.roles]
            })
          }
  
          
        } */
    }

    // 取消更新角色的回调
    handleCancelUpdate = () => {
        this.setState({ isShowAuth: false })
        // this.form.resetFields()
    }
    //用于展示授权弹窗
    showAuth = (id) => {
        const { roles } = this.state
        let result = roles.find((item) => {
            return item._id === id
        })
        if (result) {
            console.log(result);
            this.setState({ checkedKeys: result.menus })
        }
        this.setState({ isShowAuth: true, _id: id })
    }
    //展示新增弹窗
    showAdd = () => {
        // this.form.resetFields()
        this.setState({ isShowAdd: true })
        
    }

    render() {
        const { roles, checkedKeys, isShowAdd, isShowAuth } = this.state
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: (time) => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                key: 'auth_time',
                render: (time) => time ? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : ''
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name',
            },
            {
                title: '操作',
                key: 'option',
                render: (item) => <Button type='link' onClick={() => { this.showAuth(item._id) }}>设置权限</Button>
            }
        ];
        const title = (
            <span>
                <Button onClick={() => {this.showAdd()}} type='primary'>创建角色</Button> &nbsp; &nbsp;
                {/* <Button type='primary' disabled={!role._id}
                    onClick={() => { this.setState({ isShowAuth: true }) }} >设置角色权限</Button> */}
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={columns}
                    /* pagination={{ defaultPageSize: 3 }} */
                    onRow={this.onRow} />
                <Modal
                    title='添加角色'
                    visible={isShowAdd}
                    onOk={this.handleOk}
                    onText="确认"
                    cancelText="取消"
                    onCancel={this.handleCancel}
                >
                    <ADDForm setForm={form => this.form = form} />
                </Modal>
                <Modal
                    onText="确认"
                    cancelText="取消"
                    title='设置角色权限'
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={this.handleCancelUpdate}
                >
                    <AuthForm ref={this.auth} role={checkedKeys} />
                </Modal>
            </Card>
        )
    }
}
export default Role