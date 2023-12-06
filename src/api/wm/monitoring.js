import request from '@/utils/request'
const router = '/wm/monitoring'
export function GetInventoryMonitoring() {
    return request({
        url: `${router}/GetInventoryMonitoring`,
        method: 'get',
    })
}
export function GetInventoryMonitoringByLocation() {
    return request({
        url: `${router}/GetInventoryMonitoringByLocation`,
        method: 'get',
    })
}
export function GetInventoryMonitoringByDifference(params) {
    return request({
        url: `${router}/GetInventoryMonitoringByDifference`,
        method: 'get',
        params
    })
}
export function GetInventoryMonitoringByDifferenceByExcel(params) {
    return request({
        url: `${router}/GetInventoryMonitoringByDifferenceByExcel`,
        method: 'get',
        params
    })
}