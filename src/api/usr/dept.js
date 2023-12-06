import request from '@/utils/request'

/*
export function tree() {
  return request({
    url: '/depts/tree',
    method: 'get'
  })
}
*/

export function list() {
  return request({
    url: '/usr/depts',
    method: 'get'
  })
}

export function save(data) {
  let methodName = 'post'
  let url = '/usr/depts'
  if (data.id !== 0 && data.id !== undefined) {
    methodName = 'put'
    url = url + '/' + data.id
  }
  return request({
    url: url,
    method: methodName,
    data
  })
}

export function del(id) {
  return request({
    url: `/usr/depts/${id}`,
    method: 'delete'
  })
}

export function getall() {
  return request({
    url: `/usr/depts/getall`,
    method: 'get'
  })
}
