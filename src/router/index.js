import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/tag',
    component: Layout,
    redirect: '/tag/table',
    children: [
      {
        path: 'table',
        name: 'tag',
        component: () => import('@/views/tag/index'),
        meta: { title: '标签管理', icon: 'el-icon-star-on' }
      }
    ]
  },

  {
    path: '/type',
    component: Layout,
    redirect: '/type/table',
    children: [
      {
        path: 'table',
        name: 'type',
        component: () => import('@/views/type/index'),
        meta: { title: '分类管理', icon: 'el-icon-s-opportunity' }
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/table',
    children: [
      {
        path: 'comment',
        name: 'comment',
        component: () => import('@/views/comment/index'),
        meta: { title: '评论管理', icon: 'el-icon-s-comment' }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/table',
    name: 'blogContoller',
    meta: { title: '博客管理', icon: 'el-icon-collection' },
    children: [
      {
        path: 'table',
        name: 'blogList',
        component: () => import('@/views/blog/index'),
        meta: { title: '博客列表', icon: 'table' }
      }, 
      {
        path: 'info',
        name: 'blogInfo',
        component: () => import('@/views/blog/info'),
        meta: { title: '发布博客', icon: 'el-icon-edit' }
      },
      {
        path: 'info/:id',
        name: 'blogInfoEdit',
        component: () => import('@/views/blog/info'),
        meta: { title: '编辑博客', noCache: true},
        hidden: true
      },
      {
        path: 'content/:id',
        name: 'blogContent',
        component: () => import('@/views/blog/content'),
        meta: { title: '完善内容', noCache: true},
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'blogPublish',
        component: () => import('@/views/blog/publish'),
        meta: { title: '最终发布', noCache: true},
        hidden: true
      },
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/visit',
    meta: { title: '日志管理', icon: 'el-icon-more' },
    children: [
      {
        path: 'visit',
        name: 'visit',
        component: () => import('@/views/log/visit'),
        meta: { title: '访客日志管理', icon: 'el-icon-s-tools' }
      },
      {
        path: 'operate',
        name: 'operate',
        component: () => import('@/views/log/operate'),
        meta: { title: '操作日志管理', icon: 'el-icon-setting' }
      }
    ]
  },

]

export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/table',
    meta: { title: '用户管理', icon: 'el-icon-user'},
    children: [
      {
        path: 'table',
        name: 'user',
        component: () => import('@/views/user/user'),
        meta: { title: '用户列表', icon: 'el-icon-user-solid', roles: ['admin']}
      },
      {
        path: 'visitor',
        name: 'visitor',
        component: () => import('@/views/user/visitor'),
        meta: { title: '访客列表', icon: 'el-icon-s-custom'}
      }
    ]
  },
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
