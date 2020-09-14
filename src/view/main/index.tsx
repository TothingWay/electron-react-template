import React, { memo, useState, useEffect } from 'react'
import { Layout, Menu, Input } from 'antd'
import Scroll from '../../components/Scroll'
import MenuAvatar from '../../components/MenuAvatar'
import './index.scss'
import { WechatOutlined } from '@ant-design/icons'
const { Content, Footer, Sider } = Layout
const { Search } = Input

const accounts = [
  {
    dot: true,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    dot: false,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
]

const users = [
  {
    count: 2,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 1,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
  {
    count: 0,
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
  },
]

function Main() {
  // 菜单收缩展开
  const [collapsed, setCollapsed] = useState(false)
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
  }

  // 账号数据
  const [accountList, setAccountList] = useState<Array<any>>([])
  useEffect(() => {
    setAccountList(accounts)
  }, [])

  // 用户数据
  const [userList, setUserList] = useState<Array<any>>([])
  useEffect(() => {
    setUserList(users)
  }, [])
  return (
    <Layout className="layout-main">
      <Sider
        className="sider-account"
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="dark-background">
          <WechatOutlined />
        </div>
        <Scroll
          bounceTop={false}
          bounceBottom={false}
          data={accountList}
          style={{ height: 'calc(100% - 54px)' }}
        >
          <Menu
            className="menu-large"
            theme="dark"
            defaultSelectedKeys={['0']}
            mode="inline"
          >
            {accountList.map((item, index) => {
              return (
                <Menu.Item
                  key={index}
                  icon={<MenuAvatar dot={item.dot} src={item.src} />}
                >
                  <span className="menu-name">{'账号' + (index + 1)}</span>
                </Menu.Item>
              )
            })}
          </Menu>
        </Scroll>
      </Sider>
      <Sider className="sider-users">
        <div className="user-search-wrapper">
          <Search
            size="small"
            placeholder="搜索"
            onSearch={(value) => console.log(value)}
            enterButton
          />
        </div>

        <Scroll
          bounceTop={false}
          bounceBottom={false}
          data={userList}
          style={{ height: 'calc(100% - 54px)' }}
        >
          <Menu
            className="menu-large menu-users"
            defaultSelectedKeys={['1']}
            mode="inline"
          >
            {userList.map((item, index) => {
              return (
                <Menu.Item
                  key={index}
                  icon={<MenuAvatar count={item.count} src={item.src} />}
                >
                  <span className="menu-name">{'用户' + (index + 1)}</span>
                </Menu.Item>
              )
            })}
          </Menu>
        </Scroll>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            Bill is a cat.
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}

export default memo(Main)
