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
