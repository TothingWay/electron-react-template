/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useEffect, useState, useCallback } from 'react'
import { getSaleProduct } from '../../api'
import './index.scss'
import Scroll from '../../components/Scroll'
import clipboard from '../../utils/clipboard'
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
  Modal,
  Form,
  Select,
  Radio,
  Upload,
  Cascader,
} from 'antd'
import {
  EditOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { getQueryObject } from '../../utils'
import cityOptions from './cities'
const { Search } = Input

console.log(cityOptions)

function Order() {
  const [list, setList] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [visible, setVisible] = useState(true)
  const [productName, setProductName] = useState('')
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [shoppingList, setShoppingList] = useState<Array<any>>([])
  const [formData, setFormData] = useState<any>({
    user_wechat_id: getQueryObject(window.location.search).wxid,
  })

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

  const handleOrder = useCallback(() => {
    if (!shoppingList.length) {
      message.info('请选添加商品至购物车后再下单')
      return
    }
    Modal.confirm({
      title: '你确定对购物车中的商品下单吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log('OK')
      },
    })
  }, [shoppingList.length])

  const handleOk = useCallback(() => {
    setVisible(false)
  }, [])

  const handleCancel = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    console.log(getQueryObject(window.location.search))

    getList()
  }, [current, getList, pageSize, productName])

  const onFormChange = (formItem: any, form: any) => {
    setFormData({ ...form })
  }

  const onFinish = (form: any) => {
    setFormData({ ...form })
  }

  function beforeUpload(file: File) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 文件!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const uploadButton = (loading: boolean) => {
    return <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}</div>
  }

  const [enterImageUrl, setEnterImageUrl] = useState<string | null>(null)
  const [enterImageLoading, setEnterImageLoading] = useState(false)
  const handleEnterUploadChange = () => {
    console.log(1)
  }

  const [outImageUrl, setoutImageUrl] = useState<string | null>(null)
  const [outImageLoading, setoutImageLoading] = useState(false)
  const handleOutUploadChange = () => {
    console.log(1)
  }

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
                                style={{ objectFit: 'contain' }}
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
              <Button type="primary" onClick={handleOrder}>
                下单
              </Button>,
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
                          src={item.pic}
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

      <Modal
        title="表单填写"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="80%"
      >
        <Cascader
          options={cityOptions}
          placeholder="选择省市区"
          style={{ marginBottom: '10px' }}
        />
        <Form
          layout="horizontal"
          initialValues={formData}
          onValuesChange={onFormChange}
          onFinish={onFinish}
          labelCol={{ flex: '85px' }}
          wrapperCol={{ flex: '1 1 85px' }}
        >
          <Row>
            <Col xs={24} sm={12}>
              <Form.Item name="order_no" label="销售">
                <Select allowClear placeholder="销售">
                  <Select.Option value={1}>待发货</Select.Option>
                  <Select.Option value={2}>已发货</Select.Option>
                  <Select.Option value={3}>已完成</Select.Option>
                  <Select.Option value={4}>已关闭</Select.Option>
                  <Select.Option value={5}>退货中</Select.Option>
                  <Select.Option value={6}>已退货</Select.Option>
                  <Select.Option value={7}>无效订单</Select.Option>
                  <Select.Option value={8}>部分发货</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="receiver_name" label="客户微信">
                <Input disabled placeholder="客户微信" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="receiver_name" label="订单总价">
                <Input placeholder="订单总价" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="receiver_phone" label="商品类型">
                <Radio.Group>
                  <Radio value={1}>普通商品</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="express_no" label="收款类型">
                <Radio.Group>
                  <Radio value={1}>全款</Radio>
                  <Radio value={2}>预售单</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="express_no" label="支付方式">
                <Radio.Group>
                  <Radio value={1}>微信</Radio>
                  <Radio value={2}>支付宝</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="express_no" label="已转给财务">
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="express_no" label="提前打单">
                <Radio.Group>
                  <Radio value={1}>不需提前打单</Radio>
                  <Radio value={2}>提前打单</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="enter" valuePropName="fileList" label="入账截图">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={
                    process.env.REACT_APP_API2 + '/bms/sale/order/upload/img'
                  }
                  beforeUpload={beforeUpload}
                  onChange={handleEnterUploadChange}
                >
                  {enterImageUrl ? (
                    <img
                      src={enterImageUrl}
                      alt="avatar"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton(enterImageLoading)
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="out" valuePropName="fileList" label="出账截图">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={
                    process.env.REACT_APP_API2 + '/bms/sale/order/upload/img'
                  }
                  beforeUpload={beforeUpload}
                  onChange={handleOutUploadChange}
                >
                  {outImageUrl ? (
                    <img
                      src={outImageUrl}
                      alt="avatar"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton(outImageLoading)
                  )}
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="express_no" label="姓名">
                <Input placeholder="姓名" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="express_no" label="联系电话">
                <Input placeholder="联系电话" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="address" label="收货地址">
                <Form.Item name="cities" noStyle>
                  <Cascader
                    options={cityOptions}
                    placeholder="选择省市区"
                    style={{ marginBottom: '10px' }}
                  />
                </Form.Item>
                <Form.Item name="receiver_address" noStyle>
                  <Input.TextArea placeholder="详细地址" />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="express_no" label="客户备注">
                <Input.TextArea placeholder="客户备注" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default memo(Order)
