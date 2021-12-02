import Vue from 'vue'
import { Form, FormItem , Button , Input , Message } from 'element-ui'


Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
// 全局挂载，将Message挂载到vue原型中，所有组件都可以使用
Vue.prototype.$message = Message
