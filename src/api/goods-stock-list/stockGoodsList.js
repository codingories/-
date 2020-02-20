import request from '@/utils/request'
import qs from 'qs'

export function getStocksGoodsList(token) {
  return request({
    url: '/api/v1/admin-stocks/stocks-goods-list',
    method: 'get',
    params: token
  })
}

export function addGoods(data) {
  return request({
    url: '/api/v1/admin-goods/add-goods',
    method: 'post',
    data: qs.stringify(data)
  })
}
