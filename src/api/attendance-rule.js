import request from '@/utils/request'
import qs from 'qs'

export function getAttendanceRule(token) {
  return request({
    url: '/api/v1/attendance-rule/get-list',
    method: 'get',
    params: token
  })
}

export function deleteAttendanceRule(data) {
  return request({
    url: '/api/v1/attendance-rule/delete-rule',
    method: 'get',
    params: data
  })
}

export function getItemList(token) {
  return request({
    url: '/api/v1/attendance-rule/get-item-list',
    method: 'get',
    params: token
  })
}

export function deleteRuleItem(data) {
  return request({
    url: '/api/v1/attendance-rule/delete-rule-item',
    method: 'get',
    params: data
  })
}

export function createRule(data) {
  return request({
    url: '/api/v1/attendance-rule/create-rule',
    method: 'post',
    data: qs.stringify(data)
  })
}


export function saveRuleItems(data) {
  return request({
    url: '/api/v1/attendance-rule/save-rule-items',
    method: 'post',
    data: qs.stringify(data)
  })
}
