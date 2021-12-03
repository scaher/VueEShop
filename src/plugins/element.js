import Vue from 'vue'
import { Form, FormItem , Button , Input , Message , Container , Header , Aside ,
    Main , Menu , Submenu , MenuItem , Breadcrumb , BreadcrumbItem , Card , Row , Col , 
    table , tableColumn , Switch , Tooltip , Pagination} from 'element-ui'


Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
// Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(table)
Vue.use(tableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
// 全局挂载，将Message挂载到vue原型中，所有组件都可以使用
Vue.prototype.$message = Message
