import React, { Component } from 'react'
import { Button, Card, List, /* message */ } from "antd"
import { connect } from 'react-redux'
// import { nanoid } from 'nanoid'
// import {reqProdById} from '../../api'
// import { reqProdById,reqCategoryList } from '../../api'
import { LeftCircleOutlined } from '@ant-design/icons'
import './css/detail.less'
// import { BASE_IMG_URL } from '../../utils/constants'


const { Item } = List
@connect(
    state => ({
        productList: state.productList,
        categoryList: state.categoryList
    })

)
class Detail extends Component {

    state = {
        categoryId: '',
        // categoryName:'',
        desc: '',
        detail: '',
        imgs: [],
        name: '',
        price: '',
        isLoding: false
    }

    componentDidMount() {
        const { id } = this.props.match.params
        const reduxProdList = this.props.productList
        const reduxCateList = this.props.categoryList
        console.log(reduxCateList);
        console.log(reduxProdList);
        if (reduxProdList.length) {
            let result = reduxProdList.find((item) => item._id === id)
            console.log(result);
            if (result) {
                this.categoryId = result._id
                this.setState({ ...result })
            }
        }
        // else this.getProdById(id)
        if (reduxCateList.length) {
            let result = reduxCateList.find((item) => item._id === this.categoryId)
            console.log(result);
            //   this.setState({categoryName:result.name,isLoading:false})
        }
        // else this.getCategorylist()
    }


    /* getCategorylist = async () => {
        let result = await reqCategoryList()
        const { status, data, msg } = result
        if (status === 0) {
            let result = data.find((item) => {
                return item._id === data.categoryId
            })
            if (result) this.setState({ categoryName: result.name, isLoding: false })
        }
        else {
            message.error(msg, 1)
        }
    } */

    /* getProdById = async(id)=>{
        let result = await reqProdById(id)
        const {status,data} = result
        if(status === 0){
            this.categoryId = data.categoryId
            this.setState({...result})

        }else{
            message.error(msg,1)
        }
        console.log(result);
    } */


    render() {
        const { /* categoryId,  */desc, detail, /* imgs, */ name, price,/* categoryName, */ isLoding } = this.state
        return (
            <div>
                <Card title={
                    <div className='left-top'>
                        <Button onClick={() => { this.props.history.goBack() }} type="link">
                            <LeftCircleOutlined />
                            <span>商品详情</span>
                        </Button>
                    </div>
                } loading={isLoding}>
                    <List>
                        <Item>
                            <span className="prod-title">商品名称:</span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className="prod-title">商品描述:</span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className="prod-title">商品价格:</span>
                            <span>{price}</span>
                        </Item>
                        <Item>
                            <span className="prod-title">所属分类:</span>
                            <span>所属分类id不一致</span>
                        </Item>
                        <Item>
                            <span className="prod-title">商品图片:</span>
                            {/* {
                                imgs.map(img => {
                                    return (
                                        <img
                                            key={nanoid()}
                                            className='product-img'
                                            src={BASE_IMG_URL + img} alt="图片1"
                                            style={{ width: 200, height: 200 }}
                                        />
                                    )
                                })
                            } */}

                            <img
                                className='product-img'
                                src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2343860813,4292986121&fm=15&gp=0.jpg" alt="图片1"
                            />
                            <img className='product-img'
                                src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2343860813,4292986121&fm=15&gp=0.jpg" alt="图片"
                            />
                        </Item>
                        <Item>
                            <span className="prod-title">商品详情:</span>
                            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                        </Item>
                    </List>
                </Card>
            </div>
        )
    }
}
export default Detail