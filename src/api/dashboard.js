import request from '@/utils/request'

export function getDashboardData() {
  return request({
    url: `/service_admin/dashboard`,
    method: 'get'
  })
}
