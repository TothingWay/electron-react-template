import React, { memo, useState, useEffect } from 'react'
import { Layout, Menu, Input, Dropdown } from 'antd'
import Scroll from '../../components/Scroll'
import MenuAvatar from '../../components/MenuAvatar'
import ChatBubble from '../../components/ChatBubble'
import Editor from '../../components/Editor'
import 'braft-editor/dist/index.css'
import { MenuOutlined } from '@ant-design/icons'
import './index.scss'
import { useHistory } from 'react-router-dom'
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

const chatRecords = [
  {
    position: 'left',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content:
      '有两只兔子，一只叫我喜欢你，另一只叫我不喜欢你，有一天我不喜欢你出去了，那么留在家里的这只叫什么?',
  },
  {
    position: 'right',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '我不说，说了你占便宜。',
  },
  {
    position: 'left',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content:
      '胡说，我是在很正经的问问题，你一定想太多了，不知道就说不知道，我不会看不起你的。',
  },
  {
    position: 'right',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '谁说我不知道啊!',
  },
  {
    position: 'left',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '你就是不知道!',
  },
  {
    position: 'right',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '我知道，我喜欢你。',
  },
  {
    position: 'left',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '哇，你不知道就算了，突然表白吓人家一大跳。',
  },
  {
    position: 'right',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '你占我便宜。',
  },
  {
    position: 'left',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '西湖的水，我的泪!我情愿和你化作一团火焰，这是什么歌?',
  },
  {
    position: 'right',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '千年等一回。',
  },
  {
    position: 'left',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '只是因为在人群是多看了你一眼，这首呢?是谁唱的?',
  },
  {
    position: 'right',
    src:
      'https://avatars2.githubusercontent.com/u/15687309?s=460&u=4410fa4fd1a67670c219cbf0ce29be5f019c2547&v=4',
    content: '王菲唱的。',
  },
]

function Main() {
  const history = useHistory()
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

  // 聊天记录
  const [chatRecordList, setChatRecordList] = useState<Array<any>>([])
  useEffect(() => {
    setChatRecordList(chatRecords)
  }, [])

  const handleMenuClick = ({ key }: any) => {
    if (key === 'logout') {
      history.push('/login')
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  )

  return (
    <Layout className="layout-main">
      <Sider
        className="sider-account"
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div id="dark-background" className="dark-background">
          <Dropdown
            overlay={menu}
            trigger={['click']}
            getPopupContainer={() =>
              document.getElementById('dark-background') as HTMLElement
            }
          >
            <MenuOutlined />
          </Dropdown>
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
          style={{ height: 'calc(100% - 55px)' }}
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
      <Layout className="main-layout">
        <div className="main-layout-header">用户1</div>
        <Content>
          <Scroll
            bounceTop={false}
            bounceBottom={false}
            data={accountList}
            style={{ height: '100%' }}
          >
            <div className="scroll-content">
              {chatRecordList.map((item, index) => {
                return (
                  <ChatBubble
                    key={index}
                    position={item.position}
                    content={item.content}
                    src={item.src}
                  />
                )
              })}
            </div>
          </Scroll>
        </Content>
        <Footer className="footer-edit" style={{ height: '210px' }} id="footer">
          <Editor />
        </Footer>
      </Layout>
    </Layout>
  )
}

export default memo(Main)
