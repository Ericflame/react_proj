import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

// 用来指定商品详情的富文本编程器组件
export default class RichTextEditor extends Component {

  /* static propTypes = {
    detail: PropTypes.string
  } */
  state = {
    // 创建一个没有内容的编辑对象
    editorState: EditorState.createEmpty()//构建一个初始化状态的编辑器+内容
  }
  // 输入过程中实时的回调
  onEditorStateChange = (editorState) => {
    this.setState({ editorState })
  }
  getRichText = () => {
    const {editorState} = this.state
    // 返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }
  setRichText = (html)=>{
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: '1px solid #ddd', minHeight: 200, paddingLeft: 10 }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: { uploadCallback: this.uploadImageCallback, alt: { present: true, mandatory: true } }
        }}
      />

    )
  }
}
