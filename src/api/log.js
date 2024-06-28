import request from '@/utils/request'

export function getVisitorLogList(pageNum, pageSize) {
  return request({
    url: `/service_admin/log/visitor/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getVisitorLogListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/log/visitor/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: query
  })
}

export function getOperatorLogList(pageNum, pageSize) {
  return request({
    url: `/service_admin/log/operator/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getOperatorLogListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/log/operator/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: query
  })
}

export function getExcelV() {
  return request({
    url: `/service_admin/log/visitor/excel`,
    method: 'post',
    responseType: 'blob'
  })
}
export function getExcelO() {
  return request({
    url: `/service_admin/log/operator/excel`,
    method: 'post',
    responseType: 'blob'
  })
}