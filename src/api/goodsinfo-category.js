import request from '@/utils/request'
import qs from 'qs'

export function getGoodsCategory(token) {
  return request({
    url: '/api/v1/admin-goods/category-list',
    method: 'get',
    params: token
  })
}

export function addGoodsCategory(data) {
  return request({
    url: '/api/v1/admin-goods/save-category',
    method: 'post',
    data: qs.stringify(data)
  })
}

