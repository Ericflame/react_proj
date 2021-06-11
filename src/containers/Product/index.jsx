import React, { Component } from 'react'
import { Card, Button, Select, Input, Table, message } from 'antd';
import {connect} from 'react-redux' 
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import {createSaveProductAction} from '../../redux/actions_creators/product_action'
import { reqProductList, reqUpdateProdStatus, reqSearchProduct } from '../../api/index'
import { PAGE_SIZE } from '../../config';
const { Option } = Select;

@connect(
    state => ({}),
    {
        saveProduct:createSaveProductAction
    }
)
class Product extends Component {
    state = {
        productList: [], //商品列表数据
        total: '',//当前在哪一页
        current: 1,//一共有几页
        keyWord: '',//搜索关键词
        searchType: 'productName',
        isLoading:true
    }
    componentDidMount() {
        this.getProductList()
    }
    getProductList = async (a = 1) => {
        let result
        if (this.isSearch) {
            const { searchType, keyWord } = this.state
            result = await reqSearchProduct(a, PAGE_SIZE, searchType, keyWord)
        } else {
            result = await reqProductList(a, PAGE_SIZE)
        }
        this.setState({ isLoading: false })
        const { status, data } = result
        if (status === 0) {
            // console.log(data);
            this.setState({
                productList: data.list,
                total: data.total,
                current: data.pageNum
            })
            //把获取的商品列表存入redux中
            this.props.saveProduct(data.list)
        } else {
            message.error('获取商品列表失败')
        }
    }
    updateProdStatus = async ({ _id, status }) => {
        let productList = [...this.state.productList]
        if (status === 1) status = 2
        else status = 1
        let result = await reqUpdateProdStatus(_id, status)
        if (result.status === 0) {
            message.success('更新商品状态成功')
            productList = productList.map((item) => {
                if (item._id === _id) {
                    item.status = status
                }
                return item
            })
            this.setState({ productList })
        }
        else message.error('更新商品状态失败')
    }
    search = async () => {
        this.isSearch = true
        this.getProductList()
    }
    render() {
        const { productList, total, current,isLoading } = this.state
        const dataSource = productList
        const columns = [
            {
                title: '商品名称',
                width: '18%',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: '9%',
                key: 'price',
                render: price => `￥${price}`,
                align: 'center',
            },
            {
                title: '状态',
                // dataIndex: 'status',
                width: '10%',
                key: 'status',
                align: 'center',
                render: (item) => {
                    return (
                        <>
                            <Button
                                type={item.status === 1 ? 'danger' : 'primary'}
                                onClick={() => { this.updateProdStatus(item) }}
                            >
                                {item.status === 1 ? '下架' : '上架'}
                            </Button><br />
                            <span>{item.status === 1 ? '在售' : '已停售'}</span>
                        </>
                    )
                }
            },
            {
                title: '操作',
                width: '10%',
                // dataIndex: 'opera',
                // key: 'opera',
                align: 'center',
                render: (item) => {
                    return (
                        <div>
                            <Button onClick={()=>{this.props.history.push(`/Admin/prod_about/Product/detail/${item._id}`)}} type="link">详情</Button><br />
                            <Button onClick={()=>{this.props.history.push(`/Admin/prod_about/Product/add_update/${item._id}`)}} type="link">修改</Button>
                        </div>
                    )
                }
            },
        ];
        return (
            <>
                <Card
                    title={
                        <>
                            <Select defaultValue="productName" style={{ width: 120 }}
                                onChange={(value) => { this.setState({ searchType: value }) }}>
                                <Option value="productName">按名称搜索</Option>
                                <Option value="productDesc">按描述搜索</Option>
                            </Select>
                            <Input placeholder="关键字"
                                style={{ margin: '0px 1px', width: '20%' }}
                                allowClear
                                onChange={(event) => { this.setState({ keyWord: event.target.value }) }}
                            />
                            <Button type="primary" onClick={this.search}><SearchOutlined />搜索</Button>

                        </>
                    }
                    extra={<Button onClick={() => { this.props.history.push('/Admin/prod_about/Product/add_update') }} type="primary"><PlusCircleOutlined />添加商品</Button>}
                >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                        rowKey="_id"
                        loading={isLoading}
                        pagination={{
                            total: total,
                            pageSize: PAGE_SIZE,
                            current:current,
                            onChange: this.getProductList
                        }}
                    />
                </Card>
            </>
        )
    }
}
export default Product