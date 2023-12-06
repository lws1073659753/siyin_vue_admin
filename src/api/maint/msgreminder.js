import request from '@/utils/request'

const router = '/maint/msgreminder'

export function getList(params) {
  return request({
    url: router,
    method: 'get',
    params
  })
}

export function save(data) {
  let methodName = 'post'
  if (data.id !=='') {
    methodName = 'put'
  }
  return request({
    url: router,
    method: methodName,
    data 
  })
}

export function remove(id) {
  return request({
    url: `${router}/${id}`,
    method: 'delete'
  })
}

