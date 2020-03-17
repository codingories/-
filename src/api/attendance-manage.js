import request from '@/utils/request'
import qs from 'qs'

export function getAttendanceGroups(token) {
  return request({
    url: '/api/v1/attendance_groups',
    method: 'get',
    params: token
  })
}

export function deleteGroup(data) {
  return request({
    url: '/api/v1/attendance_group/delete-group',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getGroupUsers(params) {
  return request({
    url: '/api/v1/admin-role/show',
    method: 'get',
    params
  })
}

// export function deleteAttendanceRule(data) {
//   return request({
//     url: '/api/v1/attendance-rule/delete-rule',
//     method: 'get',
//     params: data
//   })
// }
//
// export function getItemList(token) {
//   return request({
//     url: '/api/v1/attendance-rule/get-item-list',
//     method: 'get',
//     params: token
//   })
// }
//
// export function deleteRuleItem(data) {
//   return request({
//     url: '/api/v1/attendance-rule/delete-rule-item',
//     method: 'get',
//     params: data
//   })
// }
//
// export function createRule(data) {
//   return request({
//     url: '/api/v1/attendance-rule/create-rule',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }
//
// export function changeName(data) {
//   return request({
//     url: '/api/v1/attendance-rule/rename-rule',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }
//
//
// export function saveRuleItems(data) {
//   return request({
//     url: '/api/v1/attendance-rule/save-rule-items',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }
