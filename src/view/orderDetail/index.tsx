/* eslint-disable @typescript-eslint/camelcase */
import React, { memo, useState, useCallback, useEffect } from 'react'
import { getQueryObject } from '../../utils'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Table,
  Tooltip,
  Drawer,
  Spin,
  Tag,
  Card,
} from 'antd'
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import './index.scss'
import { getSaleOrder, getSaleOrderNo } from '../../api/index'
import { useHistory } from 'react-router-dom'
import Scroll from '../../components/Scroll'

function OrderDetail() {
  const [formData, setFormData] = useState<any>({
    user_wechat_id: getQueryObject(window.location.search).wxid,
    status: 2,
  })
  const [tableData, setTableData] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [detailList, setDetailList] = useState([])
  const history = useHistory()

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      ellipsis: {
        showTitle: false,
      },
      render: (order_no: string) => (
        <Tooltip placement="topLeft" title={order_no}>
          {order_no}
        </Tooltip>
      ),
    },
    {
      title: '金额',
      dataIndex: 'total_price',
      ellipsis: {
        showTitle: false,
      },
      render: (total_price: string) => (
        <Tooltip placement="topLeft" title={total_price}>
          {total_price}
        </Tooltip>
      ),
    },
    {
      title: '实际金额',
      dataIndex: 'pay_price',
      ellipsis: {
        showTitle: false,
      },
      render: (pay_price: string) => (
        <Tooltip placement="topLeft" title={pay_price}>
          {pay_price}
        </Tooltip>
      ),
    },
    {
      title: '收货人',
      dataIndex: 'receiver_name',
      ellipsis: {
        showTitle: false,
      },
      render: (receiver_name: string) => (
        <Tooltip placement="topLeft" title={receiver_name}>
          {receiver_name}
        </Tooltip>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'receiver_phone',
      ellipsis: {
        showTitle: false,
      },
      render: (receiver_phone: string) => (
        <Tooltip placement="topLeft" title={receiver_phone}>
          {receiver_phone}
        </Tooltip>
      ),
    },
    {
      title: '下单日期',
      dataIndex: 'create_time',
      ellipsis: {
        showTitle: false,
      },
      render: (create_time: string) => (
        <Tooltip placement="topLeft" title={create_time}>
          {create_time}
        </Tooltip>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: '80px',
      render: (text: number) => {
        if (text === 1) {
          return <Tag color="blue">待发货</Tag>
        } else if (text === 2) {
          return <Tag color="blue">已发货</Tag>
        } else if (text === 3) {
          return <Tag color="blue">已完成</Tag>
        } else if (text === 4) {
          return <Tag color="blue">已关闭</Tag>
        } else if (text === 5) {
          return <Tag color="blue">退货中</Tag>
        } else if (text === 6) {
          return <Tag color="blue">已退货</Tag>
        } else if (text === 7) {
          return <Tag color="blue">无效订单</Tag>
        } else if (text === 8) {
          return <Tag color="blue">部分发货</Tag>
        }
      },
    },
    {
      title: '发货日期',
      dataIndex: 'delivery_time',
      ellipsis: {
        showTitle: false,
      },
      render: (delivery_time: string) => (
        <Tooltip placement="topLeft" title={delivery_time}>
          {delivery_time}
        </Tooltip>
      ),
    },
    {
      title: '快递单号',
      dataIndex: 'express_no',
      ellipsis: {
        showTitle: false,
      },
      render: (express_no: string) => (
        <Tooltip placement="topLeft" title={express_no}>
          {express_no}
        </Tooltip>
      ),
    },
    {
      title: '收货地址',
      dataIndex: 'receiver_add_all',
      ellipsis: {
        showTitle: false,
      },
      render: (receiver_add_all: string) => (
        <Tooltip placement="topLeft" title={receiver_add_all}>
          {receiver_add_all}
        </Tooltip>
      ),
    },
    {
      title: '商品详情',
      dataIndex: 'handle',
      width: '80px',
      render: (text: any, record: any) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleDetail(record.order_no)}
        >
          详情
        </Button>
      ),
    },
  ]

  const onClose = () => {
    setVisible(false)
  }

  const onFormChange = (formItem: any, form: any) => {
    if (form.time && form.time.length) {
      form.begin_date = form.time[0].format('YYYY-MM-DD HH:mm:ss')
      form.end_date = form.time[1].format('YYYY-MM-DD HH:mm:ss')
    }

    setFormData({ ...form })
  }

  const onFinish = (form: any) => {
    if (form.time && form.time.length) {
      form.begin_date = form.time[0].format('YYYY-MM-DD HH:mm:ss')
      form.end_date = form.time[1].format('YYYY-MM-DD HH:mm:ss')
    }
    setFormData({ ...form })
    handleSearch()
  }

  const handleTableChange = useCallback((pagination) => {
    setCurrent(pagination.current)
    setPageSize(pagination.pageSize)
  }, [])

  const handleSearch = useCallback(() => {
    setLoading(true)

    getSaleOrder(formData, current, pageSize)
      .then((res: any) => {
        if (res.code === 200) {
          setTableData(res.data.records || [])
          setTotal(res.data.total)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, formData, pageSize])

  const handleSaleOrderNo = useCallback((order_no: string) => {
    setDetailLoading(true)
    getSaleOrderNo(order_no)
      .then((res: any) => {
        if (res.code === 200) {
          setDetailList(res.data)
        }
        setDetailLoading(false)
      })
      .catch(() => {
        setDetailLoading(false)
      })
  }, [])

  const handleDetail = useCallback(
    (order_no: string) => {
      setVisible(true)
      handleSaleOrderNo(order_no)
    },
    [handleSaleOrderNo],
  )

  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize])

  return (
    <div className="orderDetail">
      <Form
        layout="inline"
        initialValues={formData}
        onValuesChange={onFormChange}
        onFinish={onFinish}
      >
        <Form.Item name="order_no">
          <Input allowClear placeholder="订单号" />
        </Form.Item>
        <Form.Item name="receiver_name">
          <Input allowClear placeholder="收货人" />
        </Form.Item>
        <Form.Item name="receiver_phone">
          <Input allowClear placeholder="手机号" />
        </Form.Item>
        <Form.Item name="express_no">
          <Input allowClear placeholder="快递单号" />
        </Form.Item>
        <Form.Item name="time">
          <DatePicker.RangePicker
            allowClear
            showTime={{
              defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
        <Form.Item name="user_wechat_id">
          <Input placeholder="微信号" disabled />
        </Form.Item>
        <Form.Item name="status">
          <Select allowClear placeholder="订单状态">
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <SearchOutlined />
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() =>
              history.push({
                pathname: '/order',
                search: `?wxid=${getQueryObject(window.location.search).wxid}`,
              })
            }
          >
            <ShoppingCartOutlined />
            去下单
          </Button>
        </Form.Item>
      </Form>

      <Table
        tableLayout="fixed"
        columns={columns}
        rowKey={(record: any) => record.order_no}
        size="small"
        bordered
        sticky
        dataSource={tableData}
        scroll={{
          x: '100%',
        }}
        pagination={{
          current,
          pageSize,
          total,
          defaultPageSize: 50,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['50', '200', '500'],
          showTotal: (total) => `共 ${total} 条`,
        }}
        loading={loading}
        onChange={handleTableChange}
      />

      <Drawer
        title="商品详情"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Spin spinning={detailLoading}>
          <Scroll
            bounceTop={false}
            bounceBottom={false}
            data={detailList}
            style={{ height: 'calc(100vh - 55px)' }}
          >
            <div style={{ padding: '16px' }}>
              {detailList.map((item: any) => {
                return (
                  <Card
                    size="small"
                    key={item.sku_id}
                    cover={
                      <img
                        height="80px"
                        alt={item.product_name}
                        src={item.pic}
                        style={{ objectFit: 'contain' }}
                      />
                    }
                  >
                    <div className="ant-card-meta-title">
                      {item.product_name}
                    </div>
                    <div className="ant-card-meta-description">
                      商品单价：
                      <span style={{ color: '#1890ff' }}>
                        {item.sale_price_y}
                      </span>
                    </div>
                    <div className="ant-card-meta-description">
                      商品总价：
                      <span style={{ color: '#1890ff' }}>{item.total_y}</span>
                    </div>
                    <div className="ant-card-meta-description">
                      商品规格：{item.properties_value}
                    </div>
                    <div className="ant-card-meta-description">
                      SKU编码：{item.sku_id}
                    </div>
                  </Card>
                )
              })}
            </div>
          </Scroll>
        </Spin>
      </Drawer>
    </div>
  )
}

export default memo(OrderDetail)
