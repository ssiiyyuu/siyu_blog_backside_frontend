import request from '@/utils/request'

export function getCommentList(pageNum, pageSize) {
  return request({
    url: `/service_admin/comment/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getCommentListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/comment/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: {
      "query": query
    }
  })
}

export function deleteCommentById(id) {
  return request({
    url: `/service_admin/comment/${id}`,
    method: 'delete'
  })
}

export function deleteCommentByIds(ids) {
  return request({
    url: `/service_admin/comment/list/${ids}`,
    method: 'delete'
  })
}

export function getExcel() {
  return request({
    url: `/service_admin/comment/excel`,
    method: 'post',
    responseType: 'blob'
  })
}