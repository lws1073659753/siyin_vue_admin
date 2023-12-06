import request from '@/utils/request'

const router = '/wm/atchno'

export function getList(params) {
    return request({
        url: router,
        method: 'get',
        params
    })
}

export function save(data) {
    let methodName = 'post'
    if (data.id !== '') {
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
export function getall() {
    return request({
        url: `${router}/getall`,
        method: 'get',

    })
}

export function updateAtchNoState(name) {
    return request({
        url: `${router}/updateAtchNoState?name=${name}`,
        method: 'get',
    })
}
export function GetAtchNoByName(name) {
    return request({
        url: `${router}/name/${name}`,
        method: 'get',
    })
}