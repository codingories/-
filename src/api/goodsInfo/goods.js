import request from '@/utils/request'
import qs from 'qs'

export function getGoodsList(data) {
  return request({
    url: '/api/v1/admin-goods/goods-list',
    method: 'post',
    data: qs.stringify(data)
  })
}

// export function getGoodsList(data) {
//   return request({
//     url: '/api/v1/admin-goods/goods-list',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }


export function addGoods(data) {
  return request({
    url: '/api/v1/admin-goods/add-goods',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function saveGoods(data) {
  return request({
    url: '/api/v1/admin-goods/save-goods',
    method: 'post',
    data: qs.stringify(data)
  })
}

// export function chooseAttendanceGroup(data) {
//   return request({
//     url: "/api/v1/attendance_group/user",
//     method: "post",
//     data: qs.stringify(data)
//   });
// }
