import request from '@/utils/request'

export function getVisitorList(pageNum, pageSize) {
  return request({
    url: `/service_admin/visitor/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getVisitorListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/visitor/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: query
  })
}
export function getExcel() {
  return request({
    url: `/service_admin/visitor/excel`,
    method: 'post',
    responseType: 'blob'
  })
}