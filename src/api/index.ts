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
