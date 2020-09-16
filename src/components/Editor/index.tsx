import React, { useState, useRef, useEffect } from 'react'
import BraftEditor, { ControlType } from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import './index.scss'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { SmileOutlined } from '@ant-design/icons'
import { CustomEmojis } from './customEmojis'
const { hasCommandModifier } = KeyBindingUtil

function Editor() {
  const [editorState, setEditorState] = useState<any>(
    BraftEditor.createEditorState(''),
  )

  const editor = useRef<any>(null)

  // 编辑内容触发
  const handleEditorChange = (editorState: any) => {
    setEditorState(editorState)
  }

  // 换行
  const insertLineBreak = () => {
    setEditorState(ContentUtils.insertHTML(editorState, '<div><br></div>'))
  }

  // 按键绑定
  const handleKeyCommand = (command: string) => {
    if (command === 'split-block') {
      // console.log('回车')
      return 'handled'
    } else if (command === 'newline') {
      // console.log('换行')
      insertLineBreak()
      return 'handled'
    }
  }
  const myKeyBindingFn = (e: React.KeyboardEvent) => {
    // console.log('myKeyBindingFn', e.keyCode)
    if (e.keyCode === 13 /* `enter` key */ && hasCommandModifier(e)) {
      return 'newline'
    }
    return getDefaultKeyBinding(e)
  }

  useEffect(() => {
    console.log(editor.current)
  }, [])

  // emoji
  const handleEmojiSelected = (emoji: any) => {
    if (emoji.imageUrl) {
      console.log(emoji)

      setEditorState(ContentUtils.insertText(editorState, `[${emoji.name}]`))

      // editor.current.hide()
    } else {
      setEditorState(ContentUtils.insertText(editorState, `${emoji.native}`))
      // editor.current.hide()
    }
  }

  // 设置微信标题Tab图标
  const customIcons: any = {
    categories: {
      custom: () => (
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
        >
          <defs>
            <style />
          </defs>
          <path d="M816.551 248.167C697.803 131.501 553.294 97.67 394.437 140.527 114.717 215.995 28.163 506.99 169.48 696.648c6.853 9.198 8.148 26.164 5.545 38.097-7.6 34.868-18.714 68.959-28 103.475-4.966 18.455-7.905 37.212 8.632 52.02 17.778 15.921 36.826 12.654 56.258 2.777 31.88-16.201 64.336-31.314 95.763-48.337 20.47-11.087 38.848-11.659 61.943-5.24 46.063 12.8 93.718 19.872 117.993 24.748 144.317-2.603 249.61-41.736 333.958-129.489 134.31-139.731 133.331-350.607-5.02-486.53zM763.5 681.878c-104.634 103.85-232.003 128.685-369.716 82.494-45.409-15.23-82.687-19.208-122.09 7.494-3.576 2.423-8.447 2.934-26.512 8.852C281.452 717.8 254.6 678.445 224 633.824c-67.886-98.99-54.038-226.625 26.782-318.74 132.027-150.481 390.603-150.383 522.634.196 95.728 109.175 93.683 263.774-9.917 366.598z" />
          <path d="M640.33 377.432c-26.246-.962-47.458 18.595-48.956 45.14-1.533 27.156 16.637 48.23 43.304 50.227 26.571 1.99 48.85-16.263 51.569-42.247 2.866-27.407-18.489-52.113-45.917-53.12zM385.222 377.387c-27.758.206-48.888 23.685-46.822 52.024 1.94 26.61 23.155 44.91 50.213 43.318 26.505-1.561 46.149-22.887 45.152-49.02-.967-25.364-23.129-46.51-48.543-46.322z" />
        </svg>
      ),
    },
  }

  const controls: ControlType[] = [
    {
      key: 'emoji-dropdown',
      type: 'dropdown',
      // title: 'emoji', // 指定鼠标悬停提示文案
      className: 'emoji-dropdown', // 指定下拉组件容器的样式名
      html: null, // 指定在按钮中渲染的html字符串
      text: <SmileOutlined />, // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
      showArrow: false, // 指定是否显示下拉组件顶部的小三角形
      arrowActive: false, // 指定是否高亮下拉组件顶部的小三角形
      autoHide: true, // 指定是否在失去焦点时自动隐藏下拉组件
      component: (
        <Picker
          color="#1890ff"
          showPreview={false}
          include={[
            'custom',
            'people',
            'nature',
            'foods',
            'activity',
            'places',
            'objects',
            'symbols',
            'flags',
          ]}
          showSkinTones={false}
          native={true}
          onSelect={handleEmojiSelected}
          custom={CustomEmojis}
          i18n={{
            categories: {
              people: '笑脸 & 情感',
              nature: '动物 & 自然',
              foods: '食物',
              activity: '活动',
              places: '旅游 & 地方',
              objects: '物品',
              symbols: '符号',
              flags: '旗帜',
              custom: '微信',
            },
          }}
          icons={customIcons}
        />
      ), // 指定在下拉组件中显示的内容组件
    },
    'media',
  ]

  const blockExportFn = (contentState: any, block: any) => {
    const previousBlock = contentState.getBlockBefore(block.key)

    if (
      block.type === 'unstyled' &&
      previousBlock &&
      previousBlock.getType() === 'atomic'
    ) {
      return {
        start: '',
        end: '',
      }
    }
  }

  return (
    <BraftEditor
      ref={editor}
      controls={controls}
      value={editorState}
      onChange={handleEditorChange}
      controlBarClassName="edit-control-bar"
      contentClassName="edit-content"
      contentStyle={{ height: 164 }}
      handleKeyCommand={handleKeyCommand}
      draftProps={{
        keyBindingFn: myKeyBindingFn,
        editorState,
        onChange: handleEditorChange,
      }}
      converts={{ blockExportFn }}
    />
  )
}

export default Editor
