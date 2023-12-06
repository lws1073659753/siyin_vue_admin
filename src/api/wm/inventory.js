import request from '@/utils/request'

const router = '/wm/inventory'

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
export function CreateInventory(data) {
    return request({
        url: `${router}/CreateInventory`,
        method: 'post',
        data
    })
}
export function GetPalletQty(pallet) {
    return request({
        url: `${router}/GetPalletQty?pallet=${pallet}`,
        method: 'get',
    })
}

