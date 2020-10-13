import React, { memo, useEffect } from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './index.scss'
import { useHistory } from 'react-router-dom'
import useSocket from '../../hooks/useSocket'
import md5 from 'js-md5'
import { message } from 'antd'

export interface LoginParamsType {
  username: string
  password: string
}

function Login(props: any) {
  const { socket, connectSocket, sendData, getData } = useSocket()
  const history = useHistory()
  const onFinish = (values: LoginParamsType) => {
    if (socket.connected) {
      const password = md5(values.password)
      sendData('login', { username: values.username, password })
    } else {
      message.error('连接失败，请检查网络！')
    }
    console.log('Success:', values)
  }

  useEffect(() => {
    connectSocket()
    getData('login', (data) => {
      console.log(data)
      history.push('/main')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default memo(Login)
