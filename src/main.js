import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
// 引入全局页面
import './assets/css/global.css'
// 引入字体图标
import './assets/font_login/iconfont.css'
import './assets/font_home/iconfont.css'
// 引入axios
import axios from 'axios'
// 设置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 设置拦截器
axios.interceptors.request.use(config=>{
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将axios挂载到Vue原型中，方便使用
Vue.prototype.$http =  axios

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
