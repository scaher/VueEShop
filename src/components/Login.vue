<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-a-gerenyonghu"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-a-suosimiyinsi"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 登录和重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" round @click="login">登录</el-button>
          <el-button type="info" round @click="resetLoginForm1">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      //   登录表单数据绑定对象
      loginForm: {
        username: "",
        password: "",
      },
      //   表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符内", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6到16个字符内", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    // 表单清空
    resetLoginForm1() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录预验证
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const result = await this.$http.post("login", this.loginForm);

        if (result.data.meta.status !== 200)
          return this.$message.error("登录失败");
        else this.$message.success("登录成功");


        // 1. 将登录成功之后的 token 保存到客户端的 sessionStorage 中（会话期间的存储机制）（所以不放在loaclStorage中）
        window.sessionStorage.setItem("token", result.data.data.token);

        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(71, 146, 185);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
