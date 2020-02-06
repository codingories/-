import request from '@/utils/request'

export function getGoodsCategory(token) {
  return request({
    url: '/api/v1/admin-goods/category-list',
    method: 'get',
    params: token
  })
}
