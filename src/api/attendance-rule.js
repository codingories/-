import request from '@/utils/request'
import qs from 'qs'

export function getAttendanceRule(token) {
  return request({
    url: '/api/v1/attendances-rule/get-list',
    method: 'get',
    params: token
  })
}

export function deleteAttendanceRule(data) {
  return request({
    url: '/api/v1/attendances-rule/delete-rule',
    method: 'get',
    params: data
  })
}

export function getItemList(data) {
  return request({
    url: '/api/v1/attendances-rule/create-rule',
    method: 'get',
    params: data
  })
}


export function saveRuleItems(data) {
  return request({
    url: '/api/v1/attendances-rule/save-rule-items',
    method: 'post',
    data: qs.stringify(data)
  })
}
