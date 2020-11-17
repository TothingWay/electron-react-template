/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useEffect, useState, useCallback, useRef } from 'react'
import {
  getSaleProduct,
  getAdminSale,
  createSaleOrder,
  previewSaleOrder,
} from '../../api'
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
  Descriptions,
} from 'antd'
import {
  EditOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { getQueryObject, isvalidPhone } from '../../utils'
import cityOptions from './area'
const { Search } = Input
const Store = window.require('electron-store')
const store = new Store({ name: 'token' })

function Order() {
  const formRef = useRef<any>(null)
  const [list, setList] = useState([])
  const [adminlist, setAdminList] = useState<Array<any>>([])
  const [listLoading, setListLoading] = useState(false)
  const [handleOrderLoading, setHandleOrderLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [productName, setProductName] = useState('')
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [shoppingList, setShoppingList] = useState<Array<any>>([])
  const [formData, setFormData] = useState<any>({
    user_wechat_id: getQueryObject(window.location.search).wxid,
    sku_type: 1,
    receipt_type: 1,
  })

  const getList = useCallback(() => {
    setListLoading(true)
    getSaleProduct(productName, current, pageSize)
      .then((res: any) => {
        if (res.code === 200) {
          if (res.data.records) {
            console.log(res.data.records)

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

  const handleClearShoppingList = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault()
    setShoppingList([])
  }

  const handleDeleteItem = (index: number) => {
    const shoppingLists = [...shoppingList]
    shoppingLists.splice(index, 1)
    setShoppingList(shoppingLists)
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
    setHandleOrderLoading(true)
    const previewShoppingList = shoppingList.map((item) => {
      return {
        sku_id: item.sku_id,
        buy_count: item.number,
        price: item.price_y,
      }
    })

    previewSaleOrder(previewShoppingList).then((res: any) => {
      if (res.code === 200) {
        Modal.confirm({
          title: '你确定对购物车中的商品下单吗？',
          icon: <ExclamationCircleOutlined />,
          content: (
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="原价">
                {res.data.total_price}
              </Descriptions.Item>
              <Descriptions.Item label="实际价格">
                {res.data.product_price}
              </Descriptions.Item>
              <Descriptions.Item label="让利价格">
                {res.data.let_price}
              </Descriptions.Item>
              <Descriptions.Item label="总数量">
                {res.data.total_count}
              </Descriptions.Item>
            </Descriptions>
          ),
          onOk() {
            setVisible(true)

            setTimeout(() => {
              formRef.current.setFieldsValue({
                pay_price: res.data.product_price,
              })
              setFormData((val: any) => {
                return {
                  ...val,
                  token_id: res.data.token_id,
                  order_source: 1,
                  sale_wechat_id: getQueryObject(window.location.search)
                    .saleWxid,
                }
              })
              for (let i = 0; i < adminlist.length; i++) {
                if (adminlist[i].is_sale) {
                  formRef.current.setFieldsValue({
                    sale_id: adminlist[i].admin_id,
                  })
                }
              }
            }, 100)
          },
        })
      }
      setHandleOrderLoading(false)
    })
  }, [adminlist, shoppingList])

  const handleOk = useCallback(() => {
    formRef.current.validateFields().then(() => {
      const data = { ...formData }
      data.receiver_province = data.cities[0] || null
      data.receiver_city = data.cities[1] || null
      data.receiver_district = data.cities[2] || null
      createSaleOrder(data).then((res: any) => {
        if (res.code === 200) {
          message.success('下单成功！')
          setShoppingList([])
          formRef.current.resetFields()
          setVisible(false)
        }
      })
    })
  }, [formData])

  const handleCancel = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    getList()
  }, [current, getList, pageSize, productName])

  const onFormChange = (formItem: any, form: any) => {
    setFormData((val: any) => {
      return {
        ...val,
        ...form,
      }
    })
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

  const [enterImageLoading, setEnterImageLoading] = useState(false)

  const handleEnterUploadChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setEnterImageLoading(true)
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        setFormData((val: any) => {
          return {
            ...val,
            enter_pic: info.file.response.data,
          }
        })
      } else {
        message.error(info.file.response.msg)
      }

      setEnterImageLoading(false)
    }
    if (info.file.status === 'error') {
      message.error('上传失败！')
      setEnterImageLoading(false)
    }
  }

  const [outImageLoading, setoutImageLoading] = useState(false)
  const handleOutUploadChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setoutImageLoading(true)
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        setFormData((val: any) => {
          return {
            ...val,
            out_pic: info.file.response.data,
          }
        })
      } else {
        message.error(info.file.response.msg)
      }

      setoutImageLoading(false)
    }

    if (info.file.status === 'error') {
      message.error('上传失败！')
      setEnterImageLoading(false)
    }
  }

  useEffect(() => {
    getAdminSale().then((res: any) => {
      if (res.code === 200) {
        setAdminList(res.data)
      }
    })
  }, [])

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  // 手机验证
  const validatePhone = (rule: any, value: string, callback: any) => {
    if (value && !isvalidPhone(value)) {
      callback(new Error('请输入正确手机号'))
    } else {
      callback()
    }
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
            extra={
              <a href="#" onClick={(e) => handleClearShoppingList(e)}>
                清空
              </a>
            }
            actions={[
              <Button onClick={(e) => handleClipboard(e)}>复制商品信息</Button>,
              <Button
                loading={handleOrderLoading}
                type="primary"
                onClick={handleOrder}
              >
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
                          <div className="item-title">
                            {item.product_name}
                            <DeleteOutlined
                              onClick={() => handleDeleteItem(index)}
                            />
                          </div>
                          <div className="item-content">
                            <div className="item-price">
                              {item.edit ? (
                                <InputNumber
                                  style={{ width: '100px' }}
                                  defaultValue={item.price_y}
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
        title="订单信息"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="80%"
      >
        <Form
          layout="horizontal"
          initialValues={formData}
          ref={formRef}
          onValuesChange={onFormChange}
          labelCol={{ flex: '90px' }}
          wrapperCol={{ flex: '1 1 90px' }}
        >
          <Row>
            <Col xs={24} sm={12}>
              <Form.Item name="sale_id" label="销售">
                <Select allowClear placeholder="销售">
                  {adminlist.map((item: any) => {
                    return (
                      <Select.Option key={item.admin_id} value={item.admin_id}>
                        {item.nickname}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="user_wechat_id" label="客户微信">
                <Input disabled placeholder="客户微信" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="pay_price" label="订单总价">
                <Input allowClear placeholder="订单总价" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="sku_type" label="商品类型">
                <Radio.Group>
                  <Radio value={1}>普通商品</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="receipt_type" label="收款类型">
                <Radio.Group>
                  <Radio value={1}>全款</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="payment_type"
                label="支付方式"
                rules={[{ required: true, message: '该项为必填项!' }]}
              >
                <Radio.Group>
                  <Radio value={1}>支付宝</Radio>
                  <Radio value={2}>微信</Radio>
                  <Radio value={3}>余额支付</Radio>
                  <Radio value={4}>礼品卡</Radio>
                  <Radio value={5}>银行转账</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="pay_status"
                label="已转给财务"
                rules={[{ required: true, message: '该项为必填项!' }]}
              >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="advance_threaten"
                label="提前打单"
                rules={[{ required: true, message: '该项为必填项!' }]}
              >
                <Radio.Group>
                  <Radio value={2}>不需提前打单</Radio>
                  <Radio value={1}>提前打单</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="enterFileList"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                label="入账截图"
                rules={[{ required: true, message: '该项为必填项!' }]}
              >
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={
                    process.env.REACT_APP_API2 + '/bms/sale/order/upload/img'
                  }
                  headers={{
                    version: 'v2',
                    'X-Request-Token': store.get('token'),
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleEnterUploadChange}
                >
                  {formData.enter_pic ? (
                    <img
                      src={formData.enter_pic}
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
              <Form.Item
                name="outFileList"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                label="出账截图"
                rules={[{ required: true, message: '该项为必填项!' }]}
              >
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={
                    process.env.REACT_APP_API2 + '/bms/sale/order/upload/img'
                  }
                  headers={{
                    version: 'v2',
                    'X-Request-Token': store.get('token'),
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleOutUploadChange}
                >
                  {formData.out_pic ? (
                    <img
                      src={formData.out_pic}
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
              <Form.Item
                name="receiver_name"
                label="姓名"
                rules={[{ required: true, message: '该项为必填项!' }]}
              >
                <Input allowClear placeholder="姓名" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="receiver_phone"
                label="联系电话"
                rules={[
                  { required: true, message: '该项为必填项!' },
                  { validator: validatePhone },
                ]}
              >
                <Input allowClear placeholder="联系电话" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="收货地址">
                <Form.Item
                  name="cities"
                  className="cities-item"
                  rules={[{ required: true, message: '该项为必填项' }]}
                >
                  <Cascader
                    options={cityOptions}
                    fieldNames={{
                      label: 'value',
                      value: 'value',
                      children: 'items',
                    }}
                    placeholder="选择省市区"
                    showSearch
                    allowClear
                    style={{ marginBottom: '10px' }}
                  />
                </Form.Item>
                <Form.Item
                  name="receiver_address"
                  noStyle
                  rules={[{ required: true, message: '该项为必填项!' }]}
                >
                  <Input.TextArea placeholder="详细地址" />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="user_remark" label="客户备注">
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
