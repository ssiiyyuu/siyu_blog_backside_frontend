import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/service_admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/service_admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/service_admin/logout',
    method: 'post',
    params: { token }
  })
}

export function getUserList(pageNum, pageSize) {
  return request({
    url: `/service_admin/user/list/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getUserListByQuery(query, pageNum, pageSize) {
  return request({
    url: `/service_admin/user/list/query/${pageNum}/${pageSize}`,
    method: 'get',
    params: query
  })
}

export function saveOrUpdateUser(user) {
  return request({
    url: '/service_admin/user',
    method: 'post',
    data: user
  })
}

export function deleteUserById(id) {
  return request({
    url: `/service_admin/user/${id}`,
    method: 'delete'
  })
}

export function deleteUserByIds(ids) {
  return request({
    url: `/service_admin/user/list/${ids}`,
    method: 'delete'
  })
}
export function getExcel() {
  return request({
    url: `/service_admin/user/excel`,
    method: 'post',
    responseType: 'blob'
  })
}