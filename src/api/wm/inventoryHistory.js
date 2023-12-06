import request from '@/utils/request'

const router = '/wm/inventoryHistory'

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

export function CreateErrorSnHistory(data) {
    return request({
        url: `${router}/CreateErrorSnHistory`,
        method: 'post',
        data
    })
}
export function GetDataQueryTableLabel() {
    return request({
        url: `${router}/GetDataQueryTableLabel`,
        method: 'get',
    })
}
export function GetDataQueryTableLabelByAuxiliary() {
    return request({
        url: `${router}/GetDataQueryTableLabelByAuxiliary`,
        method: 'get',
    })
}

export function GetPagedAsyncByExport(params) {
    return request({
        url: `${router}/GetPagedAsyncByExport`,
        method: 'get',
        params
    })
}