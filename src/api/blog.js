import request from '@/utils/request'

export function getBlogContentById(id) {
  return request({
    url: `/service_admin/blog/content/${id}`,
    method: 'get'
  })
}

export function getBlogInfoById(id) {
  return request({
    url: `/service_admin/blog/info/${id}`,
    method: 'get'
  })
}

export function getBlogPublishById(id) {
  return request({
    url: `/service_admin/blog/publish/${id}`,
    method: 'get'
  })
}

export function getBlogList(pageNum, pageSize) {
  return request({
    url: `/service_admin/blog/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getBlogListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/blog/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: query
  })
}

export function saveOrUpdateBlog(blog, token) {
  return request({
    url: '/service_admin/blog',
    method: 'post',
    data: blog,
    params: {
      'token': token
    }
  })
}

export function deleteBlogById(id) {
  return request({
    url: `/service_admin/blog/${id}`,
    method: 'delete'
  })
}

export function deleteBlogByIds(ids) {
  return request({
    url: `/service_admin/blog/list/${ids}`,
    method: 'delete'
  })
}

export function updateBlogStatusById(id, flag) {
  return request({
    url: `/service_admin/blog/${id}`,
    method: 'put',
    params: {
      'flag': flag
    }
  })
}

export function getExcel() {
  return request({
    url: `/service_admin/blog/excel`,
    method: 'post',
    responseType: 'blob'
  })
}