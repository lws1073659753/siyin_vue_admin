import request from '@/utils/request'

const router = '/maint/notices'

export function getList(params) {
  return request({
    url: router,
    method: 'get',
    params
  })
}



export function AddClearData() {
  return request({
    url: `${router}/AddClearData`,
    method: 'get'
  })
}
