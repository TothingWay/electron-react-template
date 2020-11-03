import React, { memo, useEffect, useState, useCallback } from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './index.scss'
import { useHistory } from 'react-router-dom'
import useSocket from '../../hooks/useSocket'
import { useDispatch } from 'react-redux'
import md5 from 'js-md5'
import { message } from 'antd'
import * as actionTypes from '../../store/modules/accounts/actionCreators'
const Store = window.require('electron-store')
const store = new Store({ name: 'token' })
const storeUsername = new Store({ name: 'username' })

export interface LoginParamsType {
  username: string
  password: string
}

function Login(props: any) {
  const { socket, connectSocket, send, listen } = useSocket()
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<LoginParamsType>()
  const history = useHistory()
  const dispatch = useDispatch()

  const dispatchAccounts = useCallback(
    (accounts) => {
      dispatch(actionTypes.changeAccounts(accounts))
    },
    [dispatch],
  )

  const onFinish = useCallback(
    (values: LoginParamsType) => {
      storeUsername.set('username', values.username)
      setLoading(true)
      connectSocket()
      setFormValues(values)
    },
    [connectSocket],
  )

  useEffect(() => {
    let tips: any
    if (formValues) {
      listen('connect', () => {
        tips && tips()
        tips && message.success('连接成功，正在为您重新登录')
        const password = md5(formValues.password)
        tips = null
        send('login', { username: formValues.username, password })
      })
      listen('connect_error', () => {
        tips = message.loading('无法连接服务器，正在尝试为您重新连接！')
      })
    }
  }, [formValues, listen, send, socket])

  useEffect(() => {
    const token = store.get('token')
    console.log('loginToken', token)

    if (token) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      send('login', { session_id: token })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (socket) {
      listen('login', (data) => {
        if (data.errcode === 0) {
          store.set('token', data.session_id)
          history.push('/main')
          setLoading(false)
        } else if (data.errcode === 10004) {
          store.delete('token')
          history.push('/login')
        } else {
          message.error(data.msg)
        }
      })

      listen('accounts', (data) => {
        dispatchAccounts(data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

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
              loading={loading}
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
