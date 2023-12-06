import request from '@/utils/request'

const router = '/basicData/warehouse'

export function getList(params) {
  return request({
    url: router,
    method: 'get',
    params
  })
}

export function save(data) {
  let methodName = 'post'
  console.log(data)
  if (data.id !== 0) {
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

export function getAll() {
  return request({
    url: `${router}/getall`,
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: `${router}/${id}`,
    method: 'get'
  })
}
export function getall() {
    return request({
        url: `${router}/getall`,
        method: 'get',

    })
}