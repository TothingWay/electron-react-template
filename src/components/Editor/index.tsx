import React, { useState, useRef } from 'react'
import BraftEditor, { ControlType } from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import './index.scss'
// 引入表情包扩展模块样式文件
import 'braft-extensions/dist/emoticon.css'
// 引入表情包扩展模块和默认表情包列表
import Emoticon from 'braft-extensions/dist/emoticon'
import { CustomEmojis } from './customEmojis'
const { hasCommandModifier } = KeyBindingUtil

BraftEditor.use(
  Emoticon({
    emoticons: CustomEmojis.map((item) => item.imageUrl),
    closeOnBlur: true,
    closeOnSelect: true,
  }),
)

interface EditorProps {
  handleEnter: (messageText: string) => void
}

function Editor({ handleEnter }: EditorProps) {
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
      let messageText = editorState.toRAW(true).blocks[0].text

      const messageEntityMap = editorState.toRAW(true).entityMap || []

      // get Emoticon keywords
      for (const i in messageEntityMap) {
        for (let j = 0; j < CustomEmojis.length; j++) {
          if (messageEntityMap[i].data.src === CustomEmojis[j].imageUrl) {
            messageEntityMap[i].keywords = CustomEmojis[j].keywords
          }
        }
      }

      // replace Emoticon to string keywords
      for (const key in messageEntityMap) {
        messageText = messageText.replace(/\s/, messageEntityMap[key].keywords)
      }

      handleEnter(messageText)

      editor.current.clearEditorContent()

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

  const controls: ControlType[] = ['emoji', 'media']

  const hooks = {
    'insert-emoji': (data: any) => {
      console.log(data)
    },
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
      hooks={hooks}
      draftProps={{
        keyBindingFn: myKeyBindingFn,
        editorState,
        onChange: handleEditorChange,
      }}
    />
  )
}

export default Editor
