/* eslint-disable @typescript-eslint/camelcase */
import request from '../utils/request'

// 商品购物车列表
export const getSaleProduct = (
  skuOrName: string,
  current: number,
  size: number,
) => {
  return request({
    url: '/bms/sale/product/sku',
    method: 'get',
    params: {
      skuOrName,
      current,
      size,
    },
  })
}

// 订单列表
export const getSaleOrder = (formData: any, current: number, size: number) => {
  return request({
    url: '/bms/sale/order',
    method: 'get',
    params: {
      ...formData,
      current,
      size,
    },
  })
}

// 订单详情
export const getSaleOrderNo = (order_no: string) => {
  return request({
    url: `/bms/sale/order/${order_no}`,
    method: 'get',
  })
}

// 获取销售人员列表
export const getAdminSale = () => {
  return request({
    url: `/bms/admin/sale`,
    method: 'get',
  })
}

// 预览订单
export const previewSaleOrder = (data: any) => {
  return request({
    url: `/bms/sale/order/preview`,
    method: 'post',
    data,
  })
}

// 创建订单
export const createSaleOrder = (data: any) => {
  return request({
    url: `/bms/sale/order`,
    method: 'post',
    data,
  })
}
