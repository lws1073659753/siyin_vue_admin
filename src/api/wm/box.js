import request from '@/utils/request'

const router = '/wm/box'

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

export function GetBoxName(boxPrefix,bin,pallet) {
    return request({
        url: `${router}/GetBoxName?boxPrefix=${boxPrefix}&&bin=${bin}&&pallet=${pallet}`,
        method: 'get',
    })
}
export function AnyAsyncBoxName(BoxName) {
    return request({
        url: `${router}/AnyAsyncBoxName?BoxName=${BoxName}`,
        method: 'get',
    })
}