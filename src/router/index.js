import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home}
  ]
})

// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // 如果用户访问的是登录页，放行
  if(to.path === '/login') return next()
  // 判断是否拥有token
  if(!window.sessionStorage.getItem('token')) return next('/login')
  next()
  
})



export default router
