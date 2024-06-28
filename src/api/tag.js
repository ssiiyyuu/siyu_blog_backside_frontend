import request from '@/utils/request'

export function getTagListAll() {
  return request({
    url: `/service_admin/tag/list/all`,
    method: 'get'
  })
}

export function getTagList(pageNum, pageSize) {
  return request({
    url: `/service_admin/tag/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getTagListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/tag/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: {
      "query": query
    }
  })
}

export function saveOrUpdateTag(tag) {
  return request({
    url: '/service_admin/tag',
    method: 'post',
    data: tag
  })
}

export function deleteTagById(id) {
  return request({
    url: `/service_admin/tag/${id}`,
    method: 'delete'
  })
}

export function deleteTagByIds(ids) {
  return request({
    url: `/service_admin/tag/list/${ids}`,
    method: 'delete'
  })
}
export function getExcel() {
  return request({
    url: `/service_admin/tag/excel`,
    method: 'post',
    responseType: 'blob'
  })
}