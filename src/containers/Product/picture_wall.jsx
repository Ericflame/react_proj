import { Upload, Modal, message } from 'antd';
import React, { Component } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { reqDeletePicture } from '../../api'
import { BASE_URL } from '../../config';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  state = {
    previewVisible: false,//是否展示预览窗
    //要预览的图片的url地址
    previewImage: 'https://img2.huashi6.com/images/resource/2017/02/07/613h20011p0.jpg?imageView2/3/q/100/interlace/1/w/448/h/1600/format/webp',
    previewTitle: '',
    fileList: [//收集好的所有上传完毕的图片名
      /* {
        uid: '-1',
        name: 'image.png',
        status: 'done',//当前图片的状态：uploading\done\remove
        url: 'https://img2.huashi6.com/images/resource/2019/01/02/72h455834p0.png?imageView2/3/q/100/interlace/1/w/448/h/1600/format/webp',
      }, */
      /*       {
              uid: '-2',
              name: 'image.png',
              status: 'done',
              url: 'https://img2.huashi6.com/images/resource/2021/05/12/h89778896p0.jpg?imageView2/3/q/100/interlace/1/w/448/h/1600/format/webp',
            },
            {
              uid: '-3',
              name: 'image.png',
              status: 'done',
              url: 'https://img2.huashi6.com/images/resource/2018/09/09/7h0612393p0.png?imageView2/3/q/100/interlace/1/w/448/h/1600/format/webp',
            },
            {
              uid: '-4',
              name: 'image.png',
              status: 'done',
              url: 'https://img2.huashi6.com/images/resource/2018/09/16/70h719730p0.png?imageView2/3/q/100/interlace/1/w/448/h/1600/format/webp',
            },
            {
              uid: '-xxx',
              percent: 50,
              name: 'image.png',
              status: 'uploading',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
              uid: '-5',
              name: 'image.png',
              status: 'error',
            }, */
    ],
  };
  //关闭预览窗
  handleCancel = () => this.setState({ previewVisible: false });
  //展示预览窗
  handlePreview = async file => {
    //如果图片没有url也没有转换过base64，那么调用如下方法把图片转换为base64
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //当图片状态发生改变的回调
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      //若上传成功
      /* console.log(file.response.data.url);
      console.log(file);
      console.log(fileList);
      console.log(fileList.length); */
      // file.url = file.response.data.url
      fileList[fileList.length - 1].url = file.response.data.url
      fileList[fileList.length - 1].name = file.response.data.name
    }
    if (file.status === 'removed') {
      //删除了某个文件
      // console.log(file.name);
      let result = await reqDeletePicture(file.name)
      const { status, msg } = result
      if (status === 0) {
        message.success('删除图片成功')
      } else {
        message.error(msg)
      }
    }
    this.setState({ fileList })
  };
  //从fileList中提取出所有商品对应的图片名字，构建一个数组，供新增商品使用
  getImgArr = () => {
    let result = []
    this.state.fileList.forEach((item) => {
      result.push(item.name)
    })
    return result
  }
  setFileList = (imgArr) => {
    let result = [] 
    imgArr.forEach((item,index)=>{
      result.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
    })
    this.setState({fileList:result})
  }



  // resoponse.data.url
  // thumbUrl
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          //接收图片服务器地址
          action="/manage/img/upload"
          method="post"
          name='image'
          listType="picture-card"//照片墙的展示方式
          fileList={fileList}//图片列表，一个数组中包含着多个图片对象{uid:xxx,status:xxx,url:xxx}
          onPreview={this.handlePreview}//当点击预览按钮的回调
          onChange={this.handleChange}//图片状态改变的回调(图片上传中，图片被删除，图片成功上传)
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
export default PicturesWall