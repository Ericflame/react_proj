import React, { Component, Suspense } from 'react'
import { reqPicsList } from '../../api'
import { Image, BackTop } from 'antd'
// import styled from 'styled-components'
import './css/index.less'
import { nanoid } from 'nanoid'
export default class Home extends Component {
    state = {
        picUrl: '',
        id: '',
    }
    componentDidMount() {
        window.onscroll = this.onScroll;
        this.getPicsList()
    }
    getPicsList = async () => {
        let result = await reqPicsList()
        // console.log(result);
        this.setState({ picUrl: result })

    }
    render() {
        const { picUrl } = this.state
        const result = [...picUrl]
        return (
            <div className='box'>
                {/* <img
                    style={{ width: '200px', height: '200px', marginLeft: '100px', marginRight: '100px' }}
                    className='product-img'
                    src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2343860813,4292986121&fm=15&gp=0.jpg" alt="图片1"
                />
                <img className='product-img'
                    src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2343860813,4292986121&fm=15&gp=0.jpg" alt="图片"
                /> */}

                <Suspense fallback={<div>Loading...</div>}>
                    {
                        result.map((item) => {
                            return (
                                <div key={nanoid()} className="item">
                                    <Image
                                        key={item.id}
                                        className="imgs"
                                        width={250}
                                        height={200}
                                        src={item.download_url}
                                    />
                                </div>
                            )
                        })
                    }
                </Suspense>
                <BackTop className="back-top" />
            </div>
        )
    }
}
