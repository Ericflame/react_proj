import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import {connect} from 'react-redux'
import { PlusCircleOutlined } from '@ant-design/icons'
import { reqCategoryList,reqAddCategory,reqUpdateCategory } from '../../api/index'
import { PAGE_SIZE } from '../../config'
import {createSaveCategoryAction} from '../../redux/actions_creators/category_action'
import AddForm from '../../components/AddForm'

@connect(
    state => ({}),
    {saveCategory:createSaveCategoryAction}
)
class Category extends Component {
    state = {
        categoryList: [],//商品分类列表
        visible: false,//控制弹窗隐藏或显示
        operType: 'add',//操作类型
        showStatus: 0, //标识添加/更新的确认框是否显示 
        isLoading: true,//是否处于加载中
        modalCurrentValue: '',//弹窗显示的值---用于数据回显
        modalCurrentId: '',
    }
    componentDidMount() {
        //请求商品分类列表
        this.getCategoryList()
    }
    //获取商品分类列表
    getCategoryList = async () => {
        let result = await reqCategoryList()
        this.setState({ isLoading: false })
        const { status, data, msg } = result
        /* data.map((item)=>{
            item.key = item._id
            return item
        }) */
        if (status === 0) {
            this.setState({ categoryList: data.reverse() })
            //把商品的分类信息放入redux
            this.props.saveCategory(data)

        } else {
            message.error(msg, 1)
        }
    }
    demo = (a) => {
        console.log(a);
    }
    // 展示弹窗
    showAdd = () => {
        this.setState({
            operType: 'add',
            modalCurrentValue:'',
            modalCurrentId:'',
            visible: true,
        })
    }
    showUpdate = (item) => {
        console.log(item);
        const { _id, name } = item
        this.setState({
            modalCurrentValue: name,
            operType: 'update',
            visible: true,
            modalCurrentId: _id
        })
    }
    // 响应点击取消
    handleCancel = () => {
        this.setState({ visible: false })
        this.form.resetFields()
    }
    toAdd = async (values) => {
        let result = await reqAddCategory(values)
        const { status, data, msg } = result
        if (status === 0) {
            let categoryList = [...this.state.categoryList]
            categoryList.unshift(data)
            this.setState({ categoryList })
            message.success('新增商品分类成功')
            this.setState({ visible: false })
            this.form.resetFields()

        }
        if (status === 1) message.error(msg, 1)
    }
    // 显示添加的确认框
    handleOk = () => {
        const { operType } = this.state
        this.form.validateFields()
            .then(values => {
                if (operType === 'add') {
                    this.toAdd(values)
                    console.log("你要新增");
                }
                if (operType === 'update') {
                    // console.log(this.state.modalCurrentId,values.categoryName);
                    // this.toUpdate(this.state.modalCurrentId, values.categoryName)
                    const categoryId = this.state.modalCurrentId
                    const categoryName = values.categoryName
                    const categoryObj = {categoryId,categoryName}
                    this.toUpdate(categoryObj)
                    console.log("你要修改");
                }
            })
            .catch(errorInfo => {
                message.warning('表单输入有误，请检查', 1)
                return
            })
    }
    toUpdate = async(categoryObj) => {
        let result = await reqUpdateCategory(categoryObj)
        const {status,msg} = result
        if(status === 0 ){
            message.success('更新分类名称成功',1)
            this.getCategoryList()
            this.setState({ 
                visible: false

             })
            this.form.resetFields()
        }else{
            message.error(msg,1)
        }
    }
    render() {
        const { categoryList, visible, operType, isLoading, modalCurrentValue } = this.state
        const dataSource = categoryList
        const columns = [
            {
                title: '分类名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                // dataIndex: 'name',
                key: 'haha',
                render: (item) => { return <Button type="link" onClick={() => { this.showUpdate(item) }}>修改分类</Button> },
                width: '25%',
                align: 'center'
            },
        ];
        return (
            <>
                <Card title="" extra={<Button onClick={this.showAdd} type="primary" href="#">
                    <PlusCircleOutlined />添加</Button>}>
                    <Table rowKey="_id" bordered={true} dataSource={dataSource} columns={columns}
                        pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }} loading={isLoading} />
                </Card>
                <Modal okText="确定" cancelText="取消" title={operType === 'add' ? '新增分类' : '修改分类'}
                    visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <AddForm /* categorys={categorys} parentId={parentId} */ modalCurrentValue={modalCurrentValue}
                        setForm={(form) => { this.form = form }} />
                </Modal>
            </>
        )
    }
}

export default Category
