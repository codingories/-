import request from '@/utils/request'
import qs from 'qs'

export function getGoodsCategory(token) {
  return request({
    url: '/api/v1/admin-goods/category-list',
    method: 'get',
    params: token
  })
}

export function dealGoodsCategory(data) {
  return request({
    url: '/api/v1/admin-goods/save-category',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteGoodsCategory(data) {
  console.log(data)
  return request({
    url: '/api/v1/admin-goods/del-category',
    method: 'get',
    // params: data
    params: data
  })
}

// export function changeCategoryOrder(data) {
//   return request({
//     url: '/api/v1/admin-goods/order-category',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// export function sortCategoryOrder(params) {
//   return request({
//     url: '/api/v1/admin-goods/order-category',
//     method: 'get',
//     params
//   })
// }

export function sortCategoryOrder(data) {
  return request({
    url: '/api/v1/admin-goods/order-category',
    method: 'post',
    data: qs.stringify(data)
  })
}

// export function sortCategoryOrder(params) {
//   return request({
//     url: '/api/v1/admin-goods/order-category',
//     method: 'get',
//     params
//   })
// }

// export function sortmenu(params) {
//   return request({
//     url: '/api/v1/admin-menu/sort',
//     method: 'get',
//     params
//   })
// }
