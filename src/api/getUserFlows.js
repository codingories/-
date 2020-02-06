import request from '@/utils/request'

export function getUserFlows(token) {
  return request({
    url: 'api/v1/user-flows',
    method: 'get',
    params: { token }
  })
}

export function getFlowTemplate(obj) {
  console.log(obj)
  const access_token = obj['accessToken']
  const flow_id = obj['flow_id']
  return request({
    url: `/api/v1/flows/${flow_id}`,
    method: 'get',
    params: { access_token, flow_id }
  })
}

export function createEntry({ access_token, flow_id, tpl }) {
  const title = tpl['title']
  const data = new window.FormData()
  data.append('access_token', access_token)
  data.append('flow_id', flow_id)
  data.append('title', title)
  Object.keys(tpl).forEach(item => {
    if (item !== 'title' && item !== 'flow_name') {
      data.append(`tpl[${item}]`, tpl[item])
    }
  })
  return request({
    method: 'post',
    url: '/api/v1/entries',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function getEntries({ access_token }) {
  console.log('access_token')
  console.log(access_token)
  return request({
    method: 'get',
    url: '/api/v1/entries',
    params: { access_token }
  })
}

export function getUserFlowsApprovals({ access_token }) {
  return request({
    method: 'get',
    url: `/api/v1/user-flows`,
    params: { access_token }
  })
}
