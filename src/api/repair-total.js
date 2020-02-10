import request from '@/utils/request'
import qs from 'qs'

export const getRepairs = ({ access_token, kind }) =>
  request({
    method: 'get',
    url: `/api/v1/repairs`,
    params: { access_token, kind }
  })

export const ClaimRepair = ({ repair_id, access_token }) => {
  const data = new window.FormData()
  data.append('repair_id', repair_id)
  data.append('access_token', access_token)
  return request({
    method: 'post',
    url: '/api/v1/repair/receive',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
