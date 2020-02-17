import request from '@/utils/request'
import qs from 'qs'

export function getGoodDetail(obj) {
  return request({
    url: '/api/v1/admin-goods/goods-info',
    method: 'get',
    params: obj
  })
}

export function getGoodsCategory(token) {
  return request({
    url: '/api/v1/admin-goods/category-list',
    method: 'get',
    params: token
  })
}

export function saveGoods(data) {
  return request({
    url: '/api/v1/admin-goods/save-goods',
    method: 'post',
    data: qs.stringify(data)
  })
}
