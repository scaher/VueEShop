<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      ></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <div>
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDynaticParam(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteSynaticById(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <div>
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDynaticParam(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteSynaticById(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数/属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForms"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForms.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除弹出框 -->
    <el-dialog title="警告" :visible.sync="deletedialogVisible" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletedialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择器属性
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择器双向绑定到的数组
      selectCateKeys: [],
      //   被激活的页签名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      // 添加参数和属性表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制修改参数或者属性对话框的显示和隐藏
      editDialogVisible: false,
      // 修改数据表单的获取
      editForms: {},

      // 删除属性弹框的显示与隐藏
      deletedialogVisible: false,
      // 添加tag框数据
      inputValue:'',
      // 
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 如果按钮需要被禁用，返回true，否则返回false
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else if (this.activeName === "only") {
        return "静态属性";
      }
    },
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: result } = await this.$http.get("categories");
      if (result.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败！");
      }
      this.cateList = result.data;
    },

    // 级联选择器框选中该项变化，会触发这个函数
    async handleChange() {
      this.getParamsData();
    },

    // tab页签点击事件处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      // console.log(this.selectCateKeys)
      // 选中的不是三级分类，就重置数组
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
      }
      // 选中的是三级分类
      console.log(this.selectCateKeys);
      // 根据所选分类的id和当前所处的面板，获取对应的参数
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (result.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      console.log(result.data);
      result.data.forEach((item) => {
        // 这里将参数值从字符串分割成数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        this.inputValue = ''

      });
      if (this.activeName === "many") {
        this.manyTableData = result.data;
      } else {
        this.onlyTableData = result.data;
      }
    },
    // 监听对话框关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加参数
    addParams() {
      // 这里validate是校验
      // ref获取的是表单dom节点，存储在$refs中，在这里的dom节点有一个方法validate，
      //    校验结束后就会调用一个回调函数，参数是校验是否成功的boolean值
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: result } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (result.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 显示修改参数或属性的对话框和数据
    async showEditDynaticParam(attrId) {
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          attr_sel: this.activeName,
        }
      );
      if (result.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      this.editForms = result.data;
      this.editDialogVisible = true;
    },
    // 监听修改对话框的关闭
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 将修改后的数据传至服务器
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        const {
          data: result,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForms.attr_id}`,
          { attr_name: this.editForms.attr_name, attr_sel: this.activeName }
        );
        if (result.meta.status !== 200) {
          return this.$message.error("更改参数失败");
        }
        this.$message.success("更改参数成功");
        this.editDialogVisible = false;
        this.editForms = {};
        this.getParamsData();
      });
    },
    // 删除属性
    async deleteSynaticById(attrId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该属性, 是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )

        .then(async () => {
          const { data: result } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attrId}`
          );
          if (result.meta.status !== 200) {
            return this.$message.error("删除参数失败");
          }
          this.$message.success("删除参数成功");
          this.editForms = {};
          this.getParamsData();
          this.deletedialogVisible = false;
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 将改变后的参数可选项上传至数据库
    async saveAttrVals(row){
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    // 显示输入框
    showInput(row){
      row.inputVisible = true
      this.$nextTick(_ => {
          this.$refs.saveTagInputRef.$refs.input.focus();
      });
    },
    // 当失去焦点或者按下enter键后触发该事件
    handleInputConfirm(row){
      console.log(row.data,"_________")
      if(this.inputValue.trim().length === 0){
        row.inputVisible = false;
        this.inputValue = '';
        return
      }
      row.attr_vals.push(this.inputValue.trim())
      row.inputVisible = false;
      this.inputValue = '';
      this.saveAttrVals(row)
    },
    // 动态删除参数可选项
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    }

  },
};
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .el-table__cell{
    border-left: 20px;
  }
</style>

