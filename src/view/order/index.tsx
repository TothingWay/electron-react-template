/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useEffect, useState, useCallback } from 'react'
import { getSaleProduct } from '../../api'
import './index.scss'
import Scroll from '../../components/Scroll'
import clipboard from '../../utils/clipboard'
import { getQueryObject } from '../../utils'
import {
  Input,
  Row,
  Col,
  Card,
  Pagination,
  Spin,
  Empty,
  InputNumber,
  Button,
  message,
} from 'antd'
import { EditOutlined, CheckOutlined } from '@ant-design/icons'
const { Search } = Input

function Order() {
  const [list, setList] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [productName, setProductName] = useState('')
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [shoppingList, setShoppingList] = useState<Array<any>>([])

  const getList = useCallback(() => {
    setListLoading(true)
    getSaleProduct(productName, current, pageSize)
      .then((res: any) => {
        console.log(res)
        if (res.code === 200) {
          if (res.data.records) {
            setList(res.data.records)
          } else {
            setList([])
          }
          setTotal(res.data.total)
        }
        setListLoading(false)
      })
      .catch(() => {
        setList([])
        setListLoading(false)
      })
  }, [current, pageSize, productName])

  const onSearch = async (value: string) => {
    setProductName(value)
  }

  const handleSetShoppingList = useCallback(
    (data) => {
      const index = shoppingList.findIndex((item) => {
        return item.sku_id === data.sku_id
      })
      const shoppingLists = [...shoppingList]

      if (index === -1) {
        setShoppingList((val) => [...val, { ...data, number: 1 }])
      } else {
        shoppingLists[index].number += 1
        setShoppingList(shoppingLists)
      }
    },
    [shoppingList],
  )

  const handleShoppingListClick = useCallback(
    (index) => {
      const shoppingLists = [...shoppingList]
      shoppingLists[index].edit = true
      setShoppingList(shoppingLists)
    },
    [shoppingList],
  )

  const handleShoppingListChange = useCallback(
    (value, index) => {
      const shoppingLists = JSON.parse(JSON.stringify(shoppingList))
      shoppingLists[index].price_y = value
      setShoppingList(shoppingLists)
    },
    [shoppingList],
  )

  const handleShoppingListNumberChange = useCallback(
    (value, index) => {
      const shoppingLists = [...shoppingList]
      shoppingLists[index].number = value
      setShoppingList(shoppingLists)
    },
    [shoppingList],
  )

  const handleShoppingListEdited = useCallback(
    (index) => {
      const shoppingLists = [...shoppingList]
      if (shoppingLists[index].price_y < shoppingLists[index].min_price_y) {
        message.error(
          `单价不能小于成本价，当前成本价：${shoppingLists[index].min_price_y}`,
        )
      } else {
        shoppingLists[index].edit = false
      }

      setShoppingList(shoppingLists)
    },
    [shoppingList],
  )

  const handleClipboard = useCallback(
    (e) => {
      if (!shoppingList.length) {
        message.info('请选添加商品至购物车')
        return
      }
      let clipboardText = ''
      shoppingList.forEach((item) => {
        clipboardText += `商品名称：${item.product_name}\r\n价格：${item.price_y}\r\n规格：${item.properties_value}\r\n数量：${item.number}\r\n-----------------------------\r\n`
      })

      clipboard(clipboardText, e)
    },
    [shoppingList],
  )

  useEffect(() => {
    console.log(getQueryObject(window.location.search))

    getList()
  }, [current, getList, pageSize, productName])

  return (
    <div className="order-wrapper">
      <Row gutter={20}>
        <Col xs={24} sm={16}>
          <Search
            className="btn-search"
            placeholder="请输入商品名称"
            onSearch={onSearch}
            enterButton
          />
          <Spin spinning={listLoading} size="large">
            <Scroll
              bounceTop={false}
              bounceBottom={false}
              data={list}
              style={{ height: 'calc(100vh - 140px)', backgroundColor: '#fff' }}
            >
              <div>
                {list.length ? (
                  <Card style={{ minHeight: 'calc(100vh - 140px)' }}>
                    {list.map((item: any) => {
                      return (
                        <Card.Grid key={item.sku_id} className="card-grid">
                          <Card
                            bordered={false}
                            cover={
                              <img
                                height="80px"
                                alt={item.product_name}
                                src={item.pic}
                                style={{ objectFit: 'cover' }}
                              />
                            }
                            onClick={() => handleSetShoppingList(item)}
                          >
                            <div className="ant-card-meta-title">
                              {item.product_name}
                            </div>
                            <div className="ant-card-meta-description">
                              在售价格：
                              <span style={{ color: '#1890ff' }}>
                                {item.price_y}
                              </span>
                            </div>
                            <div className="ant-card-meta-description">
                              成本价格：
                              <span style={{ color: '#ff4d4f' }}>
                                {item.min_price_y}
                              </span>
                            </div>
                            <div className="ant-card-meta-description">
                              商品规格：{item.properties_value}
                            </div>
                            <div className="ant-card-meta-description">
                              虚拟库存：{item.virtual_inventory}
                            </div>
                            <div className="ant-card-meta-description">
                              SKU编码：{item.sku_id}
                            </div>
                          </Card>
                        </Card.Grid>
                      )
                    })}
                  </Card>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </Scroll>
          </Spin>
          <Pagination
            total={total}
            showSizeChanger
            showQuickJumper
            current={current}
            pageSizeOptions={['20', '50', '100', '500']}
            defaultPageSize={50}
            onChange={(page, pageSize) => {
              setCurrent(page)
              if (pageSize) {
                setPageSize(pageSize)
              }
            }}
            size="small"
            showTotal={(total) => `共 ${total} 条`}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Card
            className="shopping-card"
            size="small"
            title="购物车"
            extra={<a href="#">清空</a>}
            actions={[
              <Button onClick={(e) => handleClipboard(e)}>复制商品信息</Button>,
              <Button type="primary">下单</Button>,
            ]}
          >
            <Scroll
              bounceTop={false}
              bounceBottom={false}
              stopPropagation={false}
              data={shoppingList}
              style={{ height: 'calc(100vh - 157px)', backgroundColor: '#fff' }}
            >
              <div>
                {shoppingList.length ? (
                  shoppingList.map((item: any, index: number) => {
                    return (
                      <div key={item.sku_id} className="shopping-item">
                        <img
                          width="60px"
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          alt={item.product_name}
                        />
                        <div className="shopping-info">
                          <div className="item-title">{item.product_name}</div>
                          <div className="item-content">
                            <div className="item-price">
                              {item.edit ? (
                                <InputNumber
                                  style={{ width: '100px' }}
                                  defaultValue={item.price_y}
                                  formatter={(value) =>
                                    `￥ ${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ',',
                                    )
                                  }
                                  parser={(value: any) =>
                                    value.replace(/\￥\s?|(,*)/g, '')
                                  }
                                  onChange={(value) =>
                                    handleShoppingListChange(value, index)
                                  }
                                />
                              ) : (
                                <span>￥{item.price_y}</span>
                              )}
                              {item.edit ? (
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() =>
                                    handleShoppingListEdited(index)
                                  }
                                >
                                  <CheckOutlined />
                                </Button>
                              ) : (
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() => handleShoppingListClick(index)}
                                >
                                  <EditOutlined />
                                </Button>
                              )}
                            </div>
                            <InputNumber
                              defaultValue={1}
                              size="small"
                              min={1}
                              value={item.number}
                              onChange={(value) =>
                                handleShoppingListNumberChange(value, index)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </Scroll>
            <div className="total-price">
              总价：￥
              {shoppingList.reduce((accumulator, currentValue) => {
                return (
                  accumulator +
                  currentValue.price_y *
                    10000 *
                    (currentValue.number ? currentValue.number : 1)
                )
              }, 0) / 10000}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default memo(Order)
