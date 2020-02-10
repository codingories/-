import request from '@/utils/request'
import qs from 'qs'

export function getMenuList(params) {
  return request({
    url: '/api/v1/admin-menu/parent',
    method: 'get',
    params
  })
}

export function getMenus(params) {
  return request({
    url: '/api/v1/admin-menu/index',
    method: 'get',
    params
  })
}

export function saveMenu(data) {
  return request({
    url: '/api/v1/admin-menu/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function delMenu(params) {
  return request({
    url: '/api/v1/admin-menu/del',
    method: 'get',
    params
  })
}

export function sortmenu(params) {
  return request({
    url: '/api/v1/admin-menu/sort',
    method: 'get',
    params
  })
}

