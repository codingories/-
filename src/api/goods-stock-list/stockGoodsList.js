import request from '@/utils/request'
import qs from 'qs'

export function getStocksGoodsList(data) {
  return request({
    url: '/api/v1/admin-stocks/stocks-goods-list',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addGoods(data) {
  return request({
    url: '/api/v1/admin-goods/add-goods',
    method: 'post',
    data: qs.stringify(data)
  })
}
