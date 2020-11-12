/* eslint-disable @typescript-eslint/camelcase */
import React, { memo, useState, useEffect, useCallback, useRef } from 'react'
import { Layout, Menu, Input, Empty, message, Dropdown, Button } from 'antd'
import Scroll from '../../components/Scroll'
import MenuAvatar from '../../components/MenuAvatar'
import ChatBubble from '../../components/ChatBubble'
import Editor from '../../components/Editor'
import 'braft-editor/dist/index.css'
import {
  PoweroffOutlined,
  EllipsisOutlined,
  ShoppingCartOutlined,
  FundViewOutlined,
} from '@ant-design/icons'
import './index.scss'
import { useHistory } from 'react-router-dom'
import useSocket from '../../hooks/useSocket'
import { useSelector, useDispatch } from 'react-redux'
import { storeTypes } from '../../store/data'
import * as actionTypes from '../../store/modules/accounts/actionCreators'
import Fuse from 'fuse.js'
const { Content, Footer, Sider } = Layout
const { Search } = Input
const Store = window.require('electron-store')
const store = new Store({ name: 'token' })
const storeUsername = new Store({ name: 'username' })
const storeUserRecord = new Store({ name: storeUsername.get('username') })
const { ipcRenderer } = window.require('electron')

function Main() {
  const { socket, connectSocket, send, listen, disconnectSocket } = useSocket()
  const scrollFriendRef = useRef<any>(null)
  const scrollRecordRef = useRef<any>(null)
  const history = useHistory()
  // 菜单收缩展开
  const [collapsed, setCollapsed] = useState(false)
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
  }

  const accounts = useSelector((state: storeTypes) => state.accounts.accounts)

  // 账号数据
  const [accountList, setAccountList] = useState<Array<any>>(accounts)
  const [currentAccount, setCurrentAccount] = useState<any>()

  useEffect(() => {
    setAccountList([...accounts])
  }, [accounts])

  // 用户数据
  const [userList, setUserList] = useState<Array<any>>([])
  const [allUserList, setAllUserList] = useState<Array<any>>([])
  const [currentFriend, setCurrentFriend] = useState<any>([])

  // 聊天记录
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getHistoryRecord = (accountWxid: string, friendWxid: string) => {
    const records = storeUserRecord.get(storeUsername.get('username'))
    let userRecords = []
    if (records) {
      userRecords = records[accountWxid]
        ? records[accountWxid]
          ? records[accountWxid][friendWxid]
            ? records[accountWxid][friendWxid]
            : []
          : []
        : []
    }

    return userRecords
  }

  const setHistoryRecord = (
    accountWxid: string,
    friendWxid: string,
    records: Array<any>,
  ) => {
    storeUserRecord.set(storeUsername.get('username'), {
      [accountWxid]: {
        [friendWxid]: records,
      },
    })
  }

  const [chatRecords, setChatRecords] = useState<Array<any>>([])

  const dispatch = useDispatch()

  const dispatchAccounts = useCallback(
    (accounts) => {
      dispatch(actionTypes.changeAccounts(accounts))
    },
    [dispatch],
  )

  const [fuse, setFuse] = useState<any>(null)
  const initFuse = useCallback((list) => {
    setFuse(
      new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: 'nickname',
            weight: 0.7,
          },
        ],
      }),
    )
  }, [])

  const handleSearch = useCallback(
    (query) => {
      if (query) {
        setUserList(
          fuse.search(query).map((item: any) => {
            return item.item
          }),
        )
      } else {
        setUserList(allUserList)
      }
    },
    [allUserList, fuse],
  )

  useEffect(() => {
    initFuse(userList)
  }, [initFuse, userList])

  useEffect(() => {
    if (!socket || !socket.connected) {
      connectSocket()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const token = store.get('token')

    if (token && !accounts.length) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      send('login', { session_id: token })
    }
  }, [accounts.length, history, send, socket])

  useEffect(() => {
    listen('message', (data) => {
      const message = data.message.message
      const wxidTo = message.wxid_to

      const userAccounts = [...accountList]

      const ToAccountIndex = userAccounts.findIndex((item: any) => {
        return item.wxid === wxidTo
      })

      if (currentAccount && currentAccount.wxid === wxidTo) {
        setUserList(userAccounts[ToAccountIndex].friends)
      }
    })
  }, [accountList, currentAccount, listen])

  useEffect(() => {
    listen('accounts', (data) => {
      console.log('main:accounts', data)

      dispatchAccounts(data)
    })

    listen('login', (data) => {
      console.log('main', data)
      if (data.errcode === 10004) {
        store.get('token') && store.delete('token')
        history.push('/login')
      }
    })

    listen('message', (data) => {
      const message = data.message.message
      const wxidFrom = message.wxid_from
      const wxidTo = message.wxid_to
      const msg = message.msg
      let currentFri: any

      const userAccounts = [...accountList]

      const ToAccountIndex = userAccounts.findIndex((item: any) => {
        return item.wxid === wxidTo
      })

      if (ToAccountIndex !== -1) {
        for (let i = 0; i < userAccounts[ToAccountIndex].friends.length; i++) {
          // add count
          if (userAccounts[ToAccountIndex]['friends'][i].wxid === wxidFrom) {
            userAccounts[ToAccountIndex]['friends'][i].count = userAccounts[
              ToAccountIndex
            ]['friends'][i].count
              ? userAccounts[ToAccountIndex]['friends'][i].count
              : 0
            userAccounts[ToAccountIndex]['friends'][i].count += 1
            currentFri = userAccounts[ToAccountIndex]['friends'][i]
            // move to first
            userAccounts[ToAccountIndex]['friends'].splice(
              0,
              0,
              userAccounts[ToAccountIndex]['friends'].splice(i, 1)[0],
            )
          }
        }
        userAccounts[ToAccountIndex].friends.length &&
          scrollFriendRef.current.getBScroll().scrollTo(0, 0, 300)

        // setUserList
        setAccountList(userAccounts)
        if (currentAccount && currentAccount.wxid) {
          setUserList(userAccounts[ToAccountIndex].friends)
          setAllUserList(userAccounts[ToAccountIndex].friends)
        }
      }

      // set chatRecords
      if (currentFri) {
        setChatRecords((val) => [
          ...val,
          {
            position: 'left',
            content: msg,
            src: currentFri.head_img || null,
          },
        ])

        const records = getHistoryRecord(wxidTo, currentFri.wxid).concat({
          position: 'left',
          content: msg,
          src: currentFri.head_img || null,
        })

        setHistoryRecord(wxidTo, currentFri.wxid, records)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  // 聊天记录
  const [chatRecordList, setChatRecordList] = useState<Array<any>>([])
  useEffect(() => {
    setChatRecordList(chatRecords)
  }, [chatRecords])

  const handleMenuClick = () => {
    store.delete('token')
    disconnectSocket()
    history.push('/login')
  }

  const handleRemoveCurrentFriendCount = useCallback(
    (item) => {
      if (!item) {
        return
      }
      const users = [...userList]
      for (let i = 0; i < users.length; i++) {
        if (users[i].wxid === item.wxid) {
          users[i].count = 0
        }
      }

      setUserList(users)
    },
    [userList],
  )

  const showDot = useCallback((friends: Array<any>) => {
    let show = false
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].count) {
        show = true
      }
    }
    return show
  }, [])

  useEffect(() => {
    const dotList = accountList.filter((item) => {
      return showDot(item.friends)
    })

    if (dotList.length) {
      ipcRenderer.send('trayNotice', dotList[0].head_img)
    } else {
      ipcRenderer.send('clearTrayNotice')
    }
  }, [accountList, showDot, userList])

  const handleEnter = useCallback(
    (messageText) => {
      if (currentFriend && currentFriend.nickname) {
        send('message', {
          msg_type: 1,
          wxid: currentAccount.wxid,
          wxid_to: currentFriend.wxid,
          msg: messageText,
        })

        setChatRecords((chatRecords) => [
          ...chatRecords,
          {
            position: 'right',
            src: currentAccount.head_img,
            content: messageText,
          },
        ])
        const records = getHistoryRecord(
          currentAccount.wxid,
          currentFriend.wxid,
        ).concat({
          position: 'right',
          src: currentAccount.head_img,
          content: messageText,
        })
        setHistoryRecord(currentAccount.wxid, currentFriend.wxid, records)
        handleRemoveCurrentFriendCount(currentFriend)

        // move to first
        const userLists = [...userList]
        for (let i = 0; i < userLists.length; i++) {
          if (userLists[i].wxid === currentFriend.wxid) {
            userLists.splice(0, 0, userLists.splice(i, 1)[0])
          }
        }
        setUserList(userLists)
        scrollFriendRef.current.getBScroll().scrollTo(0, 0, 200)
      } else {
        message.info('请先选择一个好友发送')
      }
    },
    [
      currentAccount,
      currentFriend,
      handleRemoveCurrentFriendCount,
      send,
      userList,
    ],
  )

  const handleGetHistoryRecord = useCallback(
    (item: any) => {
      if (currentAccount) {
        setChatRecords(getHistoryRecord(currentAccount.wxid, item.wxid))
      }
    },
    [currentAccount],
  )

  useEffect(() => {
    if (scrollRecordRef.current.getBScroll()) {
      scrollRecordRef.current.getBScroll().refresh()
      const maxScrollY = scrollRecordRef.current.getBScroll().maxScrollY
      scrollRecordRef.current.getBScroll().scrollTo(0, maxScrollY)
    }
  }, [chatRecordList])

  const handleHeaderDropdownClick = ({ key }: any) => {
    // ipcRenderer.send('openNewWindow', `?wxid=${currentFriend.wxid}#/${key}`)
    ipcRenderer.send('openNewWindow', {
      hash: `#/${key}`,
      query: {
        wxid: currentFriend.wxid,
        saleWxid: currentAccount.wxid,
      },
    })
  }

  const headerDropdownMenu = (
    <Menu onClick={handleHeaderDropdownClick}>
      <Menu.Item key="order">
        <ShoppingCartOutlined /> 去下单
      </Menu.Item>
      <Menu.Item key="orderDetail">
        <FundViewOutlined /> 查看订单
      </Menu.Item>
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
          <PoweroffOutlined onClick={handleMenuClick} />
        </div>
        {/* accounts */}
        <Scroll
          bounceTop={false}
          bounceBottom={false}
          data={accountList}
          style={{ height: 'calc(100% - 54px)' }}
        >
          <div>
            {accountList.length ? (
              <Menu className="menu-large" theme="dark" mode="inline">
                {accountList.map((item) => {
                  return (
                    <Menu.Item
                      key={item.weixin_account_id}
                      icon={
                        <MenuAvatar
                          dot={showDot(item.friends)}
                          src={item.head_img}
                        />
                      }
                      onClick={() => {
                        setUserList([...item.friends])
                        setCurrentAccount({ ...item })
                        setAllUserList([...item.friends])
                      }}
                    >
                      <span className="menu-name">{item.nickname}</span>
                    </Menu.Item>
                  )
                })}
              </Menu>
            ) : (
              <Empty
                className="account-empty"
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        </Scroll>
      </Sider>
      {/* friends */}
      <Sider className="sider-users">
        <div className="user-search-wrapper">
          <Search
            size="small"
            placeholder="搜索"
            onSearch={handleSearch}
            enterButton
          />
        </div>

        <Scroll
          bounceTop={false}
          bounceBottom={false}
          data={userList}
          ref={scrollFriendRef}
          style={{ height: 'calc(100% - 55px)' }}
        >
          <div>
            {userList.length ? (
              <Menu className="menu-large menu-users" mode="inline">
                {userList.map((item) => {
                  return (
                    <Menu.Item
                      key={item.wxid}
                      icon={
                        <MenuAvatar count={item.count} src={item.head_img} />
                      }
                      onClick={() => {
                        setCurrentFriend(item)
                        handleRemoveCurrentFriendCount(item)
                        handleGetHistoryRecord(item)
                      }}
                    >
                      <span className="menu-name">{item.nickname}</span>
                    </Menu.Item>
                  )
                })}
              </Menu>
            ) : (
              <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        </Scroll>
      </Sider>
      {/* chatRecords */}
      <Layout
        className="main-layout"
        onClick={() => handleRemoveCurrentFriendCount(currentFriend)}
      >
        <div className="main-layout-header">
          <span>{currentFriend.nickname}</span>
          {currentFriend.nickname ? (
            <Dropdown
              overlay={headerDropdownMenu}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button type="text" className="btn-header-dropdown">
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          ) : null}
        </div>
        <Content>
          <Scroll
            bounceTop={false}
            bounceBottom={false}
            data={chatRecordList}
            ref={scrollRecordRef}
            style={{ height: '100%' }}
          >
            <div className="scroll-content">
              {currentFriend.nickname ? (
                chatRecordList.map((item, index) => {
                  return (
                    <ChatBubble
                      key={index}
                      position={item.position}
                      content={item.content}
                      src={item.src}
                    />
                  )
                })
              ) : (
                <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </Scroll>
        </Content>
        <Footer className="footer-edit" style={{ height: '210px' }} id="footer">
          <Editor handleEnter={handleEnter} />
        </Footer>
      </Layout>
    </Layout>
  )
}

export default memo(Main)
