import React, { Component } from 'react'
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { createSaveTitleAction } from '../../../redux/actions_creators/menu_action'
import menuList from '../../../config/menu_config'
import logo from './img/dora_19_2.png'
import "./css/left_nav.less"
const { SubMenu, Item } = Menu;

@connect(
    state => ({
        menus: state.userInfo.user.role.menus,
        username: state.userInfo.user.username
    }),
    {
        saveTitle: createSaveTitleAction
    }

)
@withRouter
class LeftNav extends Component {
    state = {
        collapsed: false,
    };
    componentDidMount() {
        // console.log(this.props.location.pathname.split('/').splice(2));      
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    hasAuth = (item) => {
        //获取当前用户可以看到的菜单的数组
        const { menus, username } = this.props
        // console.log(this.props.menus); //[ 'home','category','user','line']
        // console.log(item);//{title: "首页", key: "home", icon: "home", path: "/admin/home"}
        if (username === 'admin') return true
        else if (!item.children) {
            return menus.find((item2) => { return item2 === item.key })
        } else if (item.children) {
            return item.children.some((item3) => { return menus.indexOf(item3.key) !== -1 })
        }

        //校验菜单权限
        //eturn true
    }
    //用于创建菜单
    createMenu = (target) => {
        return target.map((item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Item key={item.key} icon={item.icon} onClick={() => { this.props.saveTitle(item.title) }}>
                            <Link to={item.key}>
                                <span>{item.title}</span>
                            </Link>
                        </Item>
                    )
                } else {
                    return (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.createMenu(item.children)}
                        </SubMenu>
                    )
                }
            }
            
        }
        
        )
    }

    render() {
        const { pathname } = this.props.location
        return (
            <div className="aside-left">
                {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button> */}
                <header className="nav-header">
                    <img src={logo} alt="" />
                    <h1 className="head">管理系统</h1>
                </header>
                <Menu
                    selectedKeys={pathname.indexOf('Product') !== -1 ? 'Product' : pathname.split('/').reverse()[0]}
                    defaultOpenKeys={pathname.split('/').splice(2)}
                    mode="inline"
                    theme="dark"
                // inlineCollapsed={this.state.collapsed}
                >
                    {
                        this.createMenu(menuList)
                    }
                </Menu>
            </div>
        )
    }
}
export default LeftNav