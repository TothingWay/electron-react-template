import React, { memo, useState, useEffect, useCallback } from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './index.scss'
// import { useHistory } from 'react-router-dom'
import webSocket from 'socket.io-client'

export interface LoginParamsType {
  userName: string
  password: string
}

function Login(props: any) {
  // const history = useHistory()
  const [ws, setWs] = useState<any>(null)
  const onFinish = (values: any) => {
    // history.push('/main')
    // console.log('Success:', values.username)
    setWs(webSocket(values.username))
  }

  const connectWebSocket = () => {
    setWs(webSocket('http://localhost:3001'))
  }

  const initWebSocket = useCallback(() => {
    ws.on('getMessage', (message: any) => {
      console.log(message)
    })
  }, [ws])

  const sendMessage = useCallback(() => {
    ws.emit('getMessage', '发送消息')
  }, [ws])

  useEffect(() => {
    // connectWebSocket()
    if (ws) {
      //連線成功在 console 中打印訊息
      console.log('success connect!')
      //設定監聽
      initWebSocket()
    }
  }, [initWebSocket, ws])

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-title">WX Tool</div>
        <Form
          size="large"
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
            <Button
              type="primary"
              className="login-form-button"
              onClick={sendMessage}
            >
              发送消息
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default memo(Login)
