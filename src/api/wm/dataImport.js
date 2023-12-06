import request from '@/utils/request'

const router = '/wm/primarydata'

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


export function excelImport(data) {
    return request({
        url: `${router}/excelImport`,
        method: 'post',
        data
    })
}
export function confirmExcelImport(data) {
    return request({
        url: `${router}/confirmExcelImport`,
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
export function GetTableLabelDynamic() {
    return request({
        url: `${router}/GetTableLabelDynamic`,
        method: 'get',
    })
}
export function GetPrimaryDataDtoBySn(scanSn,oldSn,boxName,scanPallet,projectName) {
    return request({
        url: `${router}/GetPrimaryDataDtoBySn?scanSn=${scanSn}&oldSn=${oldSn}&boxName=${boxName}&scanPallet=${scanPallet}&projectName=${projectName}`,
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