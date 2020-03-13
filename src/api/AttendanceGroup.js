import request from '@/utils/request'
import qs from 'qs'

export function getGroups(params) {
  return request({
    url: '/api/v1/attendance_groups',
    method: 'get',
    params
  })
}

export function getSelectList(params) {
  return request({
    url: '/api/v1/attendance-rule/get-list',
    method: 'get',
    params
  })
}

export function saveGroup(data) {
  return request({
    url: '/api/v1/attendance_group/save-group',
    method: 'post',
    data: qs.stringify(data)
  })
}
