import React, { Component } from 'react'
import { Button, Form, Input, Card, message, /* Cascader, */ Select } from "antd"
import { connect } from 'react-redux'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqCategoryList, reqAddProduct,reqUpdateProduct } from '../../api'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich-text-editor'


//数据验证的两种方式:1、form.UseForm 2、formRef = React.createRef();
const { Item } = Form
const { TextArea } = Input
const { Option } = Select

@connect(
    state => ({
        categoryList: state.categoryList,
        productList: state.productList
    }),
    {}
)
class AddUpdate extends Component {
    formRef = React.createRef();

    state = {
        categoryList: [],
        operaType: 'add',
        options: [],
        name: '',
        desc: '',
        price: '',
        categoryId: '',
        detail: '',
        imgs: '',
        _id: ''
    }

    constructor(props) {
        super(props)
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    componentDidMount() {
        const { categoryList, productList } = this.props
        const { id } = this.props.match.params
        // console.log(id);
        if (categoryList.length) this.setState({ categoryList })
        else this.getCategoryList()
        if (id) {
            this.setState({ operaType: 'update' })
            if (productList.length) {
                let result = productList.find((item) => {
                    // console.log(item);
                    return item._id === id
                })
                if (result) {
                    // console.log(result);
                    console.log(result.name);
                    this.setState({ ...result })
                    this.refs.pictureWall.setFileList(result.imgs)
                    this.refs.editor.setRichText(result.detail)
                }
            }/* else{
                this.getProductList()
            } */
        }
    }

    /* getProductList = async()=>{
        let result = await reqProdById()
        const {status,data,msg} = result
        if(status === 0){
            message.success('hh')
            this.setstate({...data})
            this.refs.pictureWall.setFileList(result.imgs)
            this.refs.editor.setRichText(result.detail)
        }else{
            message/error(msg)
        }
    } */

    getCategoryList = async () => {
        let result = await reqCategoryList()
        const { status, data, msg } = result
        if (status === 0) this.setState({ categoryList: data })
        else message.error(msg)
    }

    submit = (event) => { 
        event.preventDefault()
        //从上传组件中获取已经上传的图片数组
        let imgs = this.refs.pictureWall.getImgArr();
        // console.log(imgs);
        //从富文本组件中获取用户输入的文字转换为富文本的字符串
        let detail = this.refs.editor.getRichText()
        // console.log(detail);
        // 进行表单验证 通过才发送请求
        this.formRef.current.validateFields()
            .then(async values => {
                const { name, desc, price, categoryIds } = values
                // 1、收集数据
                let categoryId = categoryIds
                let pCategoryId = categoryIds
                const {operaType,_id} = this.state
                const product1 = { name, desc, price, categoryIds, imgs, detail, categoryId, pCategoryId }
                const product2 = { name, desc, price, categoryIds, imgs, detail, categoryId, pCategoryId,_id }
                // console.log(product);
                let result 
                if(operaType === 'add'){
                    result = await reqAddProduct(product1)
                }else{
                    result = await reqUpdateProduct(product2)
                }

                // console.log(result);
                const { status, msg } = result
                if (status === 0) {
                    message.success('操作成功')
                    this.props.history.replace('/Admin/prod_about/Product')
                } else {
                    message.error(msg)
                }
            })
            .catch(errorInfo => { console.log("哈哈"); })
    }

    //   // 更新options数组
    //   initOptions = async (categorys) => {
    //     // 根据categorys 生成options数组
    //     const options = categorys.map(c => ({
    //       value: c._id,
    //       label: c.name,
    //       isLeaf: false,  //不是叶子 即还有其他子集分类
    //     }))

    //     // 如果是一个二级分类商品的更新
    //     const {isUpdate,product} = this
    //     const {pCategoryId} = product
    //     if (isUpdate && pCategoryId !== '0') {
    //       // 获取相应的二级分类列表
    //       const subCategorys = await this.getCategorys(pCategoryId)
    //       // 生成二级下拉列表的options
    //       const childOptions = subCategorys.map(c=>({
    //         value: c._id,
    //         label: c.name,
    //         isLeaf: true,
    //       }))
    //       // 找到当前商品相应的一级option对象
    //       const targetOption = options.find(option => option.value === pCategoryId)
    //       // 关联到对应的一级option上
    //       targetOption.children = childOptions
    //     }

    //     // 更新options状态
    //     this.setState({options})
    //   }


    //   // 用于异步获取一级/二级分类列表 并且显示
    //   // async函数的返回值就是一个新的promise对象 promise的结果和值由async的结果决定

    //   getCategorys = async (parentId) => {
    //     const result = await reqCategorys(parentId)
    //     if (result.status === 0) {
    //       const categorys = result.data
    //       // 判断 一级列表还是二级列表
    //       if (parentId === '0') {
    //         this.initOptions(categorys)
    //       } else {
    //         // 二级列表
    //         // 返回二级列表 ===> 当前async函数返回的promise就会成功且value为categorys
    //         return categorys
    //       }
    //     }
    //   }

    // 定义验证价格的函数
    validatePrice = (value) => {
        // console.log(value);
        if (value) {
            if (value * 1 >= 0) {
                return Promise.resolve()
            } else {
                return Promise.resolve()/* reject('价格必须要大于0！') */
            }
        } else {
            return Promise.resolve()
        }
    }

    //   // 用于加载下一级列表的回调函数
    //   loadData = async selectedOptions => {
    //     // 得到点击的列表项 即option对象
    //     const targetOption = selectedOptions[0]
    //     // 显示loading效果
    //     targetOption.loading = true

    //     // 根据选中的分类 请求获取二级分类列表
    //     const subCategorys = await this.getCategorys(targetOption.value)
    //     // 隐藏loading
    //     targetOption.loading = false

    //     if (subCategorys && subCategorys.length > 0) {
    //       // 说明现在存在二级分类
    //       // 生成一个二级列表的options单
    //       const cOptions = subCategorys.map(c=>({
    //         value: c._id,
    //         label: c.name,
    //         isLeaf: true,  
    //       }))
    //       // 关联到当前的target.option身上 ===> children
    //       targetOption.children = cOptions
    //     } else {
    //       // 当前选中的列表项没有二级分类
    //       targetOption.isLeaf = true 
    //     }

    //       // 更新options状态
    //       this.setState({
    //         options: [...this.state.options],
    //       })
    //   }

    //   submit =  () => {
    //     // 进行表单验证 通过才发送请求
    //     this.formRef.current.validateFields()
    //     .then( async values => {

    //       // 1、收集数据
    //       // console.log('values',values);
    //       const {name,desc,price,categoryIds} = values
    //       let pCategoryId,categoryId
    //       if (categoryIds.length === 1) {
    //         pCategoryId = '0'
    //         categoryId = categoryIds[0]
    //       } else {
    //         pCategoryId = categoryIds[0]
    //         categoryId = categoryIds[1]
    //       }
    //       const imgs= this.pw.current.getImgs()
    //       const detail = this.editor.current.getDetail()

    //       // 封装成product对象
    //       const product = {name,desc,price,imgs,detail}
    //       console.log('product',product);

    //       /* // 如果是更新需要添加_id
    //       if (this.isUpdate) {
    //         product._id = this.product._id
    //       }

    //       // 2、调用接口请求函数去添加/更新
    //       const result = await reqAddOrUpdateProduct(product)
    //       console.log(result);
    //       // 3、根据结果显示
    //       if (result.status === 0) {
    //         message.success(`${this.isUpdate ? '更新':'添加'}商品成功！`)
    //         this.props.history.goBack()
    //       } else {
    //         message.error(`${this.isUpdate ? '更新':'添加'}商品失败！`)
    //       } */

    //       let result
    //       // 如果是更新需要添加_id
    //       if (this.isUpdate) {
    //         product._id = this.product._id
    //         result = await reaUpdateProduct(product)
    //         if (result.status === 0) {
    //           message.success(` 更新商品成功！`)
    //           this.props.history.goBack()
    //         } else {
    //           message.error(`更新商品失败！`)
    //         }
    //       } else {
    //         result = await reqAddProduct(product)
    //         // console.log('添加',result);   result.status===1
    //         if (result.status === 0) {
    //           message.success(` 添加商品成功！`)
    //           this.props.history.goBack()
    //         } else {
    //           message.error(`添加商品失败！`)
    //         }
    //       }




    //       // alert('提交请求成功')
    //       // console.log('submitvalue',values);
    //       // console.log('submit', this.pw.current.getImgs());
    //       // const imgs= this.pw.current.getImgs()
    //       // const detail = this.editor.current.getDetail()
    //       // console.log('submit',imgs,detail);
    //     })
    //     .catch(errInfo => {
    //       console.log('请求提交错误', errInfo);
    //     })
    //   }

    //   componentDidMount() {
    //     this.getCategorys('0')  //获取一级列表
    //   }

    //   UNSAFE_componentWillMount(){
    //     // 如果是添加则会没值 否则有值
    //     const product = this.props.location.state
    //     // 保存是否为更新的标识  
    //     this.isUpdate = !!product  //强制转换为一个布尔值
    //     // 保存商品 若没有 保存一个空对象 则下面设置初始值则不会报错
    //     this.product = product || {}
    //   }
    render() {
        const { operaType } = this.state
        console.log(this.state.name);
        console.log(this.state.price);
        console.log(this.state.detail);
        console.log(this.state.imgs);
        // 指定Item配置对象
        const layout = {
            labelCol: {
                span: 2,   //指定左侧label的宽度
            },
            wrapperCol: {
                span: 8,  //指定右侧包裹的宽度
            },
        }
        /* 
              const {isUpdate,product} = this
              const {pCategoryId,categoryId,imgs,detail} = product
              // 用来接收级联分类ID的数组
              const categorys = []
              if (isUpdate) {
                // 商品处于一级分类列表中
                if (pCategoryId === '0') {
                  categorys.push(categoryId)
                } else {
                  // 商品为二级分类
                  categorys.push(pCategoryId)
                  categorys.push(categoryId)
                }
              } */

        const title = (
            <span>
                <Button type="link" onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} />
                </Button>
                <span>{operaType ? '修改商品' : '添加商品'}</span>
            </span>
        )

        return (
            <Card title={title}>
                <Form ref={this.formRef} {...layout}>
                    <Item name='name'
                        initialValue={this.state.name}
                        rules={[
                            { required: true, message: '必须输入商品名称' },
                        ]}
                        label='商品名称'>
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item name='desc'
                        initialValue={this.state.des || ''}
                        rules={[
                            { required: true, message: '必须输入商品描述' },
                        ]} label='商品描述'>
                        <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 5 }} />
                    </Item>
                    <Item name='price'
                        initialValue={this.state.price || ''}
                        rules={[
                            { required: true, message: '必须输入商品价格' },
                            { validator: this.validatePrice }
                        ]} label='商品价格'>
                        <Input type='number' prefix="￥" addonAfter='元' placeholder='请输入商品价格' />
                    </Item>
                    <Item name='categoryIds' initialValue={this.state.categoryId || ''} rules={[{ required: true, message: '必须指定商品的分类' },]} label='商品分类'>
                        <Select>
                            <Option value="">请选择分类</Option>
                            {
                                this.state.categoryList.map((item) => {
                                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                                })
                            }
                        </Select>
                        {/* <Cascader
                                        placeholder='请指定商品的分类'
                                    // options={this.state.options}  //需要显示的列表数据数组
                                    // loadData={this.loadData}   //当选择某个列表项 加载下一级列表的回调
                                    /> */}
                    </Item>
                    <Item
                        label='商品图片'
                        wrapperCol={{ md: 12 }}
                    >
                        <PicturesWall ref="pictureWall"  /*  imgs={imgs}  */ />
                    </Item>
                    <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref="editor" /* detail={detail} */ />
                    </Item>
                    <Item>
                        <Button onClick={this.submit} type='primary'>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default AddUpdate