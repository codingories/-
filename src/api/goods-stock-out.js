import request from '@/utils/request'
import qs from 'qs'


export function getUserList(params) {
  return request({
    url: '/api/v1/admin-role/user-list',
    method: 'get',
    headers: { 'content-type': 'application/json' },
    params
  })
}

export function getOutActionList(token) {
  return request({
    url: '/api/v1/admin-stocks/out-action-list',
    method: 'get',
    params: token
  })
}


export function addOutAction(data) {
  return request({
    url: '/api/v1/admin-stocks/add-out-action',
    method: 'post',
    data: qs.stringify(data)
  })
}
