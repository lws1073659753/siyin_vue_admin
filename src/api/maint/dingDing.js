import request from '@/utils/request'

const router = '/maint/DingDing'

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

export function GetParentSetting() {
  return request({
    url: `${router}/GetParentSetting`,
    method: 'get'
  })
}
export function ParentSetting(data) {
    return request({
      url: `${router}/ParentSetting`,
      method: 'post',
      data
    })
  }
  export function getall() {
    return request({
      url: `${router}/getall`,
      method: 'get',
      
    })
  }