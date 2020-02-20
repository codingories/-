import request from '@/utils/request'
import qs from 'qs'

export function getWarehouseList(token) {
  return request({
    url: '/api/v1/admin-stocks/warehouse-list',
    method: 'get',
    params: token
  })
}

export function getSupplierList(token) {
  return request({
    url: '/api/v1/admin-stocks/supplier-list',
    method: 'get',
    params: token
  })
}

// export function getSupplierList(data) {
//   return request({
//     url: '/api/v1/admin-stocks/supplier-list',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }
