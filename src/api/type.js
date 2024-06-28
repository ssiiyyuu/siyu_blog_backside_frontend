import request from '@/utils/request'

export function getTypeListAll() {
  return request({
    url: `/service_admin/type/list/all`,
    method: 'get'
  })
}

export function getTypeList(pageNum, pageSize) {
  return request({
    url: `/service_admin/type/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getTypeListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/type/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: {
      "query": query
    }
  })
}

export function saveOrUpdateType(type) {
  return request({
    url: '/service_admin/type',
    method: 'post',
    data: type
  })
}

export function deleteTypeById(id) {
  return request({
    url: `/service_admin/type/${id}`,
    method: 'delete'
  })
}

export function deleteTypeByIds(ids) {
  return request({
    url: `/service_admin/type/list/${ids}`,
    method: 'delete'
  })
}

export function getExcel() {
  return request({
    url: `/service_admin/type/excel`,
    method: 'post',
    responseType: 'blob'
  })
}