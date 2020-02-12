import request from '@/utils/request'
import qs from 'qs'


export function getGoodDetail(obj) {
  return request({
    url: '/api/v1/admin-goods/goods-info',
    method: 'get',
    params: obj
  })
}
