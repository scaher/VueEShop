<template>
  <el-container class="home-container">
    <!-- 页面头部区域 -->
    <el-header>
      <div>
        <img class="home-logo" src="../assets/remilia.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 页面侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#003152" text-color="#fff" 
        active-text-color="#f15333" unique-opened :collapse="isCollapse" 
        :collapse-transition="false" router :default-active="activePath">
          <!-- 侧边栏菜单区 -->
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconsObj[item.id]" class="iconFirst"></i>
              <!-- 一级菜单文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" 
            :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <!-- 二级菜单图标 -->
              <i class="el-icon-menu"></i>
              <!-- 二级菜单文本 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主题 -->
      <el-main>
        <!-- Welcome组件路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menuList:[],
      // 字体图标对象
      iconsObj:{
        '125':'iconfont icon-yonghufill',
        '103':'iconfont icon-quanxian',
        '101':'iconfont icon-goods-copy',
        '102':'iconfont icon-dingdan',
        '145':'iconfont icon-shuju'
      },
      isCollapse:false,
      // 被激活链接地址
      activePath:'',

    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的左侧菜单数据
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮切换菜单折叠
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: rgb(3, 59, 97);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgb(0, 49, 82);
  .el-menu{
    border-right:none ;
  }
}
.el-main {
  background-color: rgb(218, 228, 230);
}
.home-container {
  height: 100%;
}
.home-logo {
  height: 60px;
  width: 60px;
}
.iconFirst{
  margin-right: 10px;
}
.toggle-button{
  background-color: rgb(2, 73, 121);
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: .2em;
  cursor: pointer;
}
</style>

