import React, { useState } from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import { Button } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import './index.scss'
const { hasCommandModifier } = KeyBindingUtil

const controls: any = [
  {
    key: 'my-component',
    type: 'component',
    component: (
      <Button size="large" className="emoji" icon={<SmileOutlined />} />
    ),
  },
]

function Editor() {
  const [editorState, setEditorState] = useState<any>(
    BraftEditor.createEditorState(''),
  )

  // 编辑内容触发
  const handleEditorChange = (editorState: any) => {
    setEditorState(editorState)
  }

  const insertLineBreak = () => {
    setEditorState(ContentUtils.insertHTML(editorState, '<div><br></div>'))
  }

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

  return (
    <BraftEditor
      controls={controls}
      value={editorState}
      controlBarClassName="edit-control-bar"
      contentClassName="edit-content"
      onChange={handleEditorChange}
      contentStyle={{ height: 164 }}
      handleKeyCommand={handleKeyCommand}
      draftProps={{
        keyBindingFn: myKeyBindingFn,
        editorState,
        onChange: handleEditorChange,
      }}
    />
  )
}

export default Editor
