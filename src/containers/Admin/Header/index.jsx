import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import { ExclamationCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import './css/header.less'
import dayjs from 'dayjs'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { reqWeather } from '../../../api'
import { createDeleteUserInfoAction } from '../../../redux/actions_creators/login_action'
import screenfull from 'screenfull'
import menuList from '../../../config/menu_config'
import sunny from './img/太阳.png'
import rainy from './img/下雨.png'
import cloud from './img/多云.png'
import snows from './img/下雪.png'
import cloudy from './img/阴天.png'
const { confirm } = Modal;

//在非路由组件中，要使用路由组件的api

@connect(
    state => ({
        userInfo: state.userInfo,
        title: state.title
    }),
    {
        deleteUser: createDeleteUserInfoAction,
    }

)
@withRouter
class Header extends Component {
    //初始化状态
    state = {
        isFull: true,
        date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
        weatherInfo: {},
        weatherPic: cloud,
        title: ''
    }
    componentWillUnmount() {
        clearInterval(this.timeID)
    }
    componentDidMount() {
        //绑定监听
        screenfull.on('change', () => {
            const isFull = !this.state.isFull
            this.setState({ isFull })
        });
        this.timeID = setInterval(() => {
            this.setState({ date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss') })
        }, 1000)
        this.getWeather()
        //展示当前菜单名称
        this.getTitle()
    }
    //切换全屏按钮的回调
    fullScreen = () => {
        screenfull.toggle()
    }
    //获取天气信息的回调
    getWeather = async () => {
        const weather = await reqWeather()
        this.setState({ weatherInfo: weather })
    }
    //退出登录的回调
    destroyAll = () => {
        Modal.destroyAll();
    }
    logout = () => {
        const { deleteUser } = this.props
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <Button onClick={this.destroyAll}>确定要退出?</Button>,
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
                deleteUser()
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    //由于接口不提供图片，创建改变天气图片的回调
    weatherPic = () => {
        const { weatherInfo } = this.state
        if (weatherInfo.weather === '多云') {
            this.setState({ weatherPic: cloud })
        }
        else if (weatherInfo.weather === '阴') {
            this.setState({ weatherPic: cloudy })
        }
        else if (weatherInfo.weather === '晴') {
            this.setState({ weatherPic: sunny })
        }
        else if (weatherInfo.weather === '雨') {
            this.setState({ weatherPic: rainy })
        }
        else if (weatherInfo.weather === '雪') {
            this.setState({ weatherPic: snows })
        }

    }
    getTitle = () => {
        let { pathname } = this.props.location

        let pathKey = pathname.split('/').reverse()[0]
        // console.log(pathKey)
        if (pathname.indexOf('Product') !== -1) { pathKey = 'Product' }
        let title = ''
        menuList.forEach((item) => {
            if (item.children instanceof Array) {
                const tmp = item.children.find((citem) => {
                    return citem.path === pathKey
                })
                if (tmp) title = tmp.title
            } else {
                if (pathKey === item.path) {
                    title = item.title
                }
            }
        })
        this.setState({ title })
    }

    render() {
        const { isFull, date, weatherInfo, weatherPic } = this.state
        const { user } = this.props.userInfo
        return (
            <header className='header'>
                <div className="header-top">
                    {/* <p className="article">摩尔庄园,快乐童年</p> */}
                    <div className="container">
                        <span>摩</span>
                        <span>尔</span>
                        <span>庄</span>
                        <span>园</span>
                        <span>,</span>
                        <span>快</span>
                        <span>乐</span>
                        <span>童</span>
                        <span>年</span>
                    </div>

                    <Button size="small" onClick={this.fullScreen}>
                        {isFull ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
                    </Button>
                    <span className="username">欢迎您,{user.username}</span>
                    <Button className="logout" type="link" onClick={this.logout}>退出登录</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {this.props.title || this.state.title}
                    </div>
                    <div className="header-bottom-right">
                        {date}
                        <img src={weatherPic} alt="天气" />
                        {weatherInfo.weather}&nbsp;&nbsp;&nbsp;温度:{weatherInfo.temperature}℃
                    </div>
                </div>
            </header>
        )
    }
}
export default Header

