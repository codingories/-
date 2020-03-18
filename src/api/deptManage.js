import request from '@/utils/request'
import qs from 'qs'

export function getDepList(token) {
  return request({
    url: '/api/v1/dept/get-dep-list',
    method: 'get',
    params: token
  })
}

export function delDepartment(data) {
  return request({
    url: '/api/v1/dept/del-dep',
    method: 'get',
    params: data
  })
}

export function getUserList(token) {
  return request({
    url: '/api/v1/admin-role/user-list',
    method: 'get',
    params: token
  })
}

export function saveDepartment(data) {
  return request({
    url: '/api/v1/dept/save-dep',
    method: 'post',
    data: qs.stringify(data)
  })
}
