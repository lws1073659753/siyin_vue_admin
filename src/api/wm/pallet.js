import request from '@/utils/request'

const router = '/wm/pallet'

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

export function GetPalletName(palletPrefix) {
    return request({
        url: `${router}/GetPalletName?palletPrefix=${palletPrefix}`,
        method: 'get',
    })
}
export function PrintInventorySheet(data) {
    return request({
        url: `${router}/PrintInventorySheet`,
        method: 'post',
        data
    })
}
export function PrintInventorySheetByBox(data) {
    return request({
        url: `${router}/PrintInventorySheetByBox`,
        method: 'post',
        data
    })
}